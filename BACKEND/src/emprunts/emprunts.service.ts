import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmpruntDto } from './dto/create-emprunt.dto';
import { UpdateEmpruntDto } from './dto/update-emprunt.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatutEmprunt, TypeRecompense } from '@prisma/client';

@Injectable()
export class EmpruntsService {
  constructor(private readonly prisma:PrismaService) { }
  async emprunterLivre(data: CreateEmpruntDto,user: any) {
    
    const etudiant= await this.prisma.utilisateur.findUnique({
      where:{
        id:user.userId
      }
    })
    if (!etudiant) {
      throw new NotFoundException("Utilisateur introuvable.");
    }

    const niveauEtudiant = etudiant.niveau ?? 0;

    let limiteEmprunts;
    if (niveauEtudiant >= 5) {
      limiteEmprunts = 3;
    } else if (niveauEtudiant >= 3) {
      limiteEmprunts = 2;
    } else {
      limiteEmprunts = 1;
    }

    let joursEmprunt=7;
    let messageBonus=""

    if (data.bonusPossedeId) {
      const bonus= await this.prisma.bonusPossede.findUnique({
        where:{id: data.bonusPossedeId},
        include:{recompense: true}
      })
      if(!bonus){
        throw new BadRequestException("Ce bonus n'existe pas.");
      }
      if (bonus.utilisateurId!==user.userId) {
        throw new BadRequestException("Ce bonus ne vous appartient pas.");
      }
      if (bonus.estConsomme) {
        throw new BadRequestException("Ce bonus a déjà été utilisé.");
      }
      if (bonus.dateExpiration && new Date()>bonus.dateExpiration) {
        throw new BadRequestException("Ce bonus a expiré.");
      }

      switch (bonus.recompense.type) {
        case TypeRecompense.PREMIUM:
          limiteEmprunts = 5;
          messageBonus = " (Bonus PREMIUM appliqué)";
          break;
        case TypeRecompense.BONUS:
          limiteEmprunts += 1;
          messageBonus = " (Bonus Livre Extra appliqué)";
          break;
        case TypeRecompense.PROLONGATION:
          joursEmprunt += 7;
          messageBonus = " (Bonus Prolongation appliqué)";
          break;
        case TypeRecompense.PROTECTION:
        case TypeRecompense.REACTIVATION:
          throw new BadRequestException(`Le bonus de type ${bonus.recompense.type} ne peut pas être utilisé lors d'un emprunt.`);
        default:
          throw new BadRequestException("Type de bonus non reconnu.");
      }
    }

    const livre=await this.prisma.livre.findUnique({
      where: {
        id:data.livreId
      }
    })
    if (!livre) {
      throw new NotFoundException("Le livre demandé n'existe pas.");
    }
    if (livre.stock<=0) {
      throw new BadRequestException("Ce livre est en rupture de stock.");
    }
    
   
   const dernierSanction= await this.prisma.sanction.findFirst({
    where:{
      utilisateurId:user.userId
    },
    orderBy:{
      dateCreation:"desc"
    } 
   })

   if (dernierSanction && dernierSanction.dureeBlocage>0) {
    const dateFinBlocage=new Date(dernierSanction.dateCreation)
    dateFinBlocage.setDate(dateFinBlocage.getDate() + dernierSanction.dureeBlocage)
    if(new Date() <dateFinBlocage){
      throw new ForbiddenException(`Vous êtes bloqué jusqu'au ${dateFinBlocage.toLocaleDateString()} suite à une sanction.`);
    }
   }

   const empruntesEnCours= await this.prisma.emprunt.count({
    where:{
      utilisateurId:user.userId,
      dateRetour:null
    }
   })
   if (empruntesEnCours>=limiteEmprunts) {
    throw new BadRequestException(`Limite atteinte : ${limiteEmprunts} livre(s) maximum avec votre niveau/bonus actuels.`);
   }
   const empruntExistant = await this.prisma.emprunt.findFirst({
      where: { utilisateurId: user.userId, livreId: data.livreId, dateRetour: null }
    });
    if (empruntExistant) {
      throw new BadRequestException("Vous avez déjà emprunté ce livre et ne l'avez pas encore rendu.");
    }
    return this.prisma.$transaction(async (tx) => {
      
      const dateEcheance = new Date();
      dateEcheance.setDate(dateEcheance.getDate() + joursEmprunt);

      const nouvelEmprunt = await tx.emprunt.create({
        data: {
          utilisateurId: user.userId,
          livreId: data.livreId,
          dateEcheance: dateEcheance,
        }
      });

      await tx.livre.update({
        where: { id: data.livreId },
        data: { stock: { decrement: 1 } }
      });

      if (data.bonusPossedeId) {
        await tx.bonusPossede.update({
          where: { id: data.bonusPossedeId },
          data: { 
            estConsomme: true,
            dateUtilisation: new Date(),
            empruntId: nouvelEmprunt.id
          }
        });
      }

      return {
        message: `Livre emprunté avec succès${messageBonus}.`,
        emprunt: nouvelEmprunt,
        aRendreLe: dateEcheance.toLocaleDateString()
      };
    });

  }

  async validerRecuperation(empruntId: number) {
    const emprunt = await this.prisma.emprunt.findUnique({ where: { id: empruntId } });
    if (!emprunt) throw new NotFoundException("Emprunt introuvable.");
    if (emprunt.statut !== StatutEmprunt.EN_ATTENTE) {
      throw new BadRequestException("Cet emprunt n'est pas en attente de récupération.");
    }

    const empruntMisAJour = await this.prisma.emprunt.update({
      where: { id: empruntId },
      data: { statut: StatutEmprunt.EN_COURS }
    });

    return { message: "Livre remis à l'étudiant (Statut: EN_COURS).", emprunt: empruntMisAJour };
  }

  async getEmpruntsEnAttente() {
    return this.prisma.emprunt.findMany({
      where: { 
        statut: StatutEmprunt.EN_ATTENTE 
      },
      include: {
        utilisateur: {
          select: { id: true, nom: true, email: true, niveau: true }
        },
        livre: {
          select: { id: true, titre: true, auteur: true, image: true }
        }
      },
      orderBy: {
        id: 'asc' 
      }
    });
  }

  async annulerEmprunt(empruntId: number) {
    const emprunt = await this.prisma.emprunt.findUnique({
      where: { id: empruntId }
    });

    if (!emprunt) throw new NotFoundException("Emprunt introuvable.");
    if (emprunt.statut !== StatutEmprunt.EN_ATTENTE) {
      throw new BadRequestException("Impossible d'annuler un emprunt qui n'est plus EN_ATTENTE.");
    }

    return this.prisma.$transaction(async (tx) => {
      
      const empruntAnnule = await tx.emprunt.update({
        where: { id: empruntId },
        data: { statut: StatutEmprunt.ANNULE }
      });

      await tx.livre.update({
        where: { id: emprunt.livreId },
        data: { stock: { increment: 1 } }
      });

      const bonusUtilise = await tx.bonusPossede.findFirst({
        where: { empruntId: empruntId }
      });

      if (bonusUtilise) {
        await tx.bonusPossede.update({
          where: { id: bonusUtilise.id },
          data: { estConsomme: false, dateUtilisation: null, empruntId: null }
        });
      }

      return {
        message: "L'emprunt a été annulé car l'étudiant ne s'est pas présenté. Le livre et les bonus ont été restitués.",
        emprunt: empruntAnnule
      };
    });
  }


  async findAll() {
    return this.prisma.emprunt.findMany({
      include: {
        utilisateur: { select: { id: true, nom: true, email: true } },
        livre: { select: { id: true, titre: true, auteur: true } }
      },
      orderBy: { id: 'desc' } 
    });
  }

  async findMesEmprunts(utilisateurId: number) {
    return this.prisma.emprunt.findMany({
      where: { utilisateurId: utilisateurId },
      include: {
        livre: { select: { id: true, titre: true, auteur: true, image: true } }
      },
      orderBy: { id: 'desc' }
    });
  }
  async getEmpruntsEnCours() {
    return this.prisma.emprunt.findMany({
      where: { statut: StatutEmprunt.EN_COURS },
      include: {
        utilisateur: { select: { id: true, nom: true, email: true, niveau: true } },
        livre: { select: { id: true, titre: true, auteur: true } }
      },
      orderBy: { dateEcheance: 'asc' } 
    });
  }

  
  

  
}
