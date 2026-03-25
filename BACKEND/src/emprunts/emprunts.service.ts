import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmpruntDto } from './dto/create-emprunt.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatutEmprunt, StatutUtilisateur, TypeRecompense, Utilisateur } from '@prisma/client';
import { JwtUser } from 'src/auth/interfaces/jwt-user.interface';
import { BadgesService } from '../badges/badges.service';

@Injectable()
export class EmpruntsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly badgesService: BadgesService,
  ) {}

  // EMPRUNTER UN LIVRE (Étudiant -> EN_ATTENTE)
  async emprunterLivre(data: CreateEmpruntDto, user: JwtUser) {
    const empruntEnRetard = await this.prisma.emprunt.findFirst({
    where: {
      utilisateurId: user.userId,
      statut: StatutEmprunt.EN_RETARD,
    },
  });

  if (empruntEnRetard) {
    throw new ForbiddenException(
      "Accès refusé. Vous avez un livre en retard. Veuillez le rendre avant de pouvoir effectuer un nouvel emprunt."
    );
  }
  
    const etudiant = await this.prisma.utilisateur.findUnique({
      where: {
        id: user.userId,
      },
    });
    if (!etudiant) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    

  if (etudiant.statut === StatutUtilisateur.BLOQUE) {
    throw new ForbiddenException(
      "Votre compte est actuellement bloqué suite à des pénalités."
    );
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

    let joursEmprunt = 7;
    let messageBonus = '';

    if (data.bonusPossedeId) {
      const bonus = await this.prisma.bonusPossede.findUnique({
        where: { id: data.bonusPossedeId },
        include: { recompense: true },
      });
      if (!bonus) {
        throw new BadRequestException("Ce bonus n'existe pas.");
      }
      if (bonus.utilisateurId !== user.userId) {
        throw new BadRequestException('Ce bonus ne vous appartient pas.');
      }
      if (bonus.estConsomme) {
        throw new BadRequestException('Ce bonus a déjà été utilisé.');
      }
      if (bonus.dateExpiration && new Date() > bonus.dateExpiration) {
        throw new BadRequestException('Ce bonus a expiré.');
      }

      switch (bonus.recompense.type) {
        case TypeRecompense.PREMIUM:
          limiteEmprunts = 5;
          messageBonus = ' (Bonus PREMIUM appliqué)';
          break;
        case TypeRecompense.BONUS:
          limiteEmprunts += 1;
          messageBonus = ' (Bonus Livre Extra appliqué)';
          break;
        case TypeRecompense.PROLONGATION:
          joursEmprunt += 7;
          messageBonus = ' (Bonus Prolongation appliqué)';
          break;
        case TypeRecompense.PROTECTION:
        case TypeRecompense.REACTIVATION:
          throw new BadRequestException(
            `Le bonus de type ${bonus.recompense.type} ne peut pas être utilisé lors d'un emprunt.`,
          );
        default:
          throw new BadRequestException('Type de bonus non reconnu.');
      }
    }

    const livre = await this.prisma.livre.findUnique({
      where: {
        id: data.livreId,
      },
    });
    if (!livre) {
      throw new NotFoundException("Le livre demandé n'existe pas.");
    }
    if (livre.stock <= 0) {
      throw new BadRequestException('Ce livre est en rupture de stock.');
    }

    const dernierSanction = await this.prisma.sanction.findFirst({
      where: {
        utilisateurId: user.userId,
      },
      orderBy: {
        dateCreation: 'desc',
      },
    });

    if (dernierSanction && dernierSanction.dureeBlocage > 0) {
      const dateFinBlocage = new Date(dernierSanction.dateCreation);
      dateFinBlocage.setDate(
        dateFinBlocage.getDate() + dernierSanction.dureeBlocage,
      );
      if (new Date() < dateFinBlocage) {
        throw new ForbiddenException(
          `Vous êtes bloqué jusqu'au ${dateFinBlocage.toLocaleDateString()} suite à une sanction.`,
        );
      }
    }

    const empruntesEnCours = await this.prisma.emprunt.count({
      where: {
        utilisateurId: user.userId,
        statut: {
          in: [
            StatutEmprunt.EN_COURS, 
            StatutEmprunt.EN_ATTENTE, 
            StatutEmprunt.EN_RETARD,
            StatutEmprunt.EN_ATTENTE_RETOUR
          ]
        }
      },
    });
    if (empruntesEnCours >= limiteEmprunts) {
      throw new BadRequestException(
        `Limite atteinte : ${limiteEmprunts} livre(s) maximum avec votre niveau/bonus actuels.`,
      );
    }
   const empruntExistant = await this.prisma.emprunt.findFirst({
      where: {
        utilisateurId: user.userId,
        livreId: data.livreId,
        statut: {
          in: [
            StatutEmprunt.EN_COURS, 
            StatutEmprunt.EN_ATTENTE, 
            StatutEmprunt.EN_RETARD,
            StatutEmprunt.EN_ATTENTE_RETOUR
          ]
        }
      },
    });
    if (empruntExistant) {
      throw new BadRequestException(
        "Vous avez déjà emprunté ce livre et ne l'avez pas encore rendu.",
      );
    }
    return this.prisma.$transaction(async (tx) => {
      const dateEcheance = new Date();
      dateEcheance.setDate(dateEcheance.getDate() + joursEmprunt);

      const nouvelEmprunt = await tx.emprunt.create({
        data: {
          utilisateurId: user.userId,
          livreId: data.livreId,
          dateEcheance: dateEcheance,
        },
      });

      await tx.livre.update({
        where: { id: data.livreId },
        data: { stock: { decrement: 1 } },
      });

      if (data.bonusPossedeId) {
        await tx.bonusPossede.update({
          where: { id: data.bonusPossedeId },
          data: {
            estConsomme: true,
            dateUtilisation: new Date(),
            empruntId: nouvelEmprunt.id,
          },
        });
      }

      return {
        message: `Livre emprunté avec succès${messageBonus}.`,
        emprunt: nouvelEmprunt,
        aRendreLe: dateEcheance.toLocaleDateString(),
      };
    });
  }

  // VALIDER LA RÉCUPÉRATION (Admin -> EN_COURS)
 async validerEmprunt(empruntId: number) {
    const emprunt = await this.prisma.emprunt.findUnique({
      where: { id: empruntId },
    });
    if (!emprunt) throw new NotFoundException('Emprunt introuvable.');
    if (emprunt.statut !== StatutEmprunt.EN_ATTENTE) {
      throw new BadRequestException(
        "Cet emprunt n'est pas en attente de récupération.",
      );
    }

    const dateAujourdhui = new Date();

    const dureeInitialeEnJours = Math.round(
      (emprunt.dateEcheance.getTime() - emprunt.dateEmprunt.getTime()) / (1000 * 3600 * 24)
    );

    const nouvelleDateEcheance = new Date(dateAujourdhui);
    nouvelleDateEcheance.setDate(nouvelleDateEcheance.getDate() + dureeInitialeEnJours);

    const empruntMisAJour = await this.prisma.emprunt.update({
      where: { id: empruntId },
      data: { 
        statut: StatutEmprunt.EN_COURS,
        dateEmprunt: dateAujourdhui,    
        dateEcheance: nouvelleDateEcheance 
      },
    });

    return {
      message: "Livre remis à l'étudiant (Statut: EN_COURS). La date d'échéance a été mise à jour.",
      emprunt: empruntMisAJour,
    };
  }

  // LECTURE (GET)
  async getEmpruntsEnAttente() {
    return this.prisma.emprunt.findMany({
      where: {
        statut: StatutEmprunt.EN_ATTENTE,
      },
      include: {
        utilisateur: {
          select: { id: true, nom: true, email: true, niveau: true, initials: true },
        },
        livre: {
          select: { id: true, titre: true, auteur: true, image: true },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findAll() {
    return this.prisma.emprunt.findMany({
      include: {
        utilisateur: { select: { id: true, nom: true, email: true, initials: true } },
        livre: { select: { id: true, titre: true, auteur: true } },
      },
      orderBy: { dateEmprunt: 'desc' },
    });
  }

  async findMesEmprunts(user: JwtUser) {
    return this.prisma.emprunt.findMany({
      where: { utilisateurId: user.userId },
      include: {
        livre: { select: { id: true, titre: true, auteur: true, image: true } },
        utilisateur:true,
      },
      orderBy: { id: 'desc' },
    });
  }

  async getEmpruntsEnCours() {
    return this.prisma.emprunt.findMany({
      where: { statut: StatutEmprunt.EN_COURS },
      include: {
        utilisateur: {
          select: { id: true, nom: true, email: true, niveau: true, initials: true },
        },
        livre: { select: { id: true, titre: true, auteur: true } },
      },
      orderBy: { dateEcheance: 'asc' },
    });
  }

  // ANNULER UN EMPRUNT (Admin -> ANNULE)
  async annulerEmprunt(empruntId: number) {
    const emprunt = await this.prisma.emprunt.findUnique({
      where: { id: empruntId },
    });

    if (!emprunt) throw new NotFoundException('Emprunt introuvable.');
    if (emprunt.statut !== StatutEmprunt.EN_ATTENTE) {
      throw new BadRequestException(
        "Impossible d'annuler un emprunt qui n'est plus EN_ATTENTE.",
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const empruntAnnule = await tx.emprunt.update({
        where: { id: empruntId },
        data: { statut: StatutEmprunt.ANNULE },
      });

      await tx.livre.update({
        where: { id: emprunt.livreId },
        data: { stock: { increment: 1 } },
      });

      const bonusUtilise = await tx.bonusPossede.findFirst({
        where: { empruntId: empruntId },
      });

      if (bonusUtilise) {
        await tx.bonusPossede.update({
          where: { id: bonusUtilise.id },
          data: { estConsomme: false, dateUtilisation: null, empruntId: null },
        });
      }

      return {
        message:
          "L'emprunt a été annulé car l'étudiant ne s'est pas présenté. Le livre et les bonus ont été restitués.",
        emprunt: empruntAnnule,
      };
    });
  }
//get emprunts en retard
  async getEmpruntsEnRetard() {
    return this.prisma.emprunt.findMany({
      where: { statut: StatutEmprunt.EN_RETARD },
      include: {
        utilisateur: {
          select: { id: true, nom: true, email: true, niveau: true, initials: true },
        },
        livre: { select: { id: true, titre: true, auteur: true } },
      },
      orderBy: { dateEcheance: 'asc' },
    });
  }

  async getEmpruntsEnAttenteRetour() {
    return this.prisma.emprunt.findMany({
      where: { statut: StatutEmprunt.EN_ATTENTE_RETOUR },
      include: {
        utilisateur: {
          select: { id: true, nom: true, email: true, niveau: true, initials: true },
        },
        livre: { select: { id: true, titre: true, auteur: true } },
      },
      orderBy: { dateRetour: 'asc' },
    });
  }

  // DÉCLARER LE RETOUR (Étudiant -> EN_ATTENTE_RETOUR)
  async declarerRetour(
    user: JwtUser,
    empruntId: number,
    bonusProtectionId?: number,
  ) {
    const emprunt = await this.prisma.emprunt.findUnique({
      where: { id: empruntId },
    });

    if (!emprunt) {
      throw new NotFoundException('Emprunt introuvable.');
    }
    if (emprunt.utilisateurId !== user.userId) {
      throw new ForbiddenException("Ce n'est pas votre emprunt.");
    }
    if (emprunt.statut !== StatutEmprunt.EN_COURS && emprunt.statut !== StatutEmprunt.EN_RETARD) {
      throw new BadRequestException(
        'Vous ne pouvez déclarer un retour que pour un livre EN_COURS.',
      );
    }

    const dateDeclaration = new Date();
    const estEnRetard = dateDeclaration > emprunt.dateEcheance;

    if (bonusProtectionId) {
      const bonus = await this.prisma.bonusPossede.findUnique({
        where: { id: bonusProtectionId },
        include: { recompense: true },
      });

      if (!bonus || bonus.utilisateurId !== user.userId) {
        throw new BadRequestException('Ce bonus ne vous appartient pas.');
      }
      if (bonus.estConsomme) {
        throw new BadRequestException('Ce bonus a déjà été utilisé.');
      }
      if (bonus.dateExpiration && dateDeclaration > bonus.dateExpiration) {
        throw new BadRequestException('Ce bonus a expiré.');
      }
      if (bonus.recompense.type !== TypeRecompense.PROTECTION) {
        throw new BadRequestException(
          "Ce n'est pas un bouclier de PROTECTION.",
        );
      }
      if (!estEnRetard) {
        throw new BadRequestException(
          "Vous n'êtes pas en retard, gardez votre bouclier !",
        );
      }
    }
    return this.prisma.$transaction(async (tx) => {
      if (bonusProtectionId) {
        await tx.bonusPossede.update({
          where: { id: bonusProtectionId },
          data: {
            estConsomme: true,
            dateUtilisation: dateDeclaration,
            empruntId: emprunt.id,
          },
        });
      }

      const empruntMisAJour = await tx.emprunt.update({
        where: { id: empruntId },
        data: {
          statut: StatutEmprunt.EN_ATTENTE_RETOUR,
          dateRetour: dateDeclaration,
        },
      });

      return {
        message: bonusProtectionId
          ? 'Retour déclaré. Votre bouclier a été activé avec succès !'
          : "Retour déclaré avec succès. En attente de validation par l'administrateur.",
        emprunt: empruntMisAJour,
      };
    });
  }

  // RETOURNER UN LIVRE (Admin -> RETOURNE + Gamification + Badges)
  async retournerLivre(empruntId: number) {
    const emprunt = await this.prisma.emprunt.findUnique({
      where: { id: empruntId },
      include: { utilisateur: true },
    });

    if (!emprunt) {
      throw new NotFoundException('Emprunt introuvable.');
    }

    if (
      emprunt.statut !== StatutEmprunt.EN_COURS &&
      emprunt.statut !== StatutEmprunt.EN_ATTENTE_RETOUR && emprunt.statut !== StatutEmprunt.EN_RETARD
    ) {
      throw new BadRequestException(
        `Impossible de retourner ce livre (Statut actuel: ${emprunt.statut}).`,
      );
    }

    const etudiantId = emprunt.utilisateurId;
    const dateFinReel = emprunt.dateRetour ? emprunt.dateRetour : new Date();
    const estEnRetard = dateFinReel > emprunt.dateEcheance;
    const bonusApplique = await this.prisma.bonusPossede.findFirst({
      where: {
        empruntId: emprunt.id,
        recompense: { type: TypeRecompense.PROTECTION },
      },
    });

    // 1. L-Transaction l-assassiya (Ktab + XP + Sanctions)
    const resultatTransaction = await this.prisma.$transaction(async (tx) => {
      const empruntMisAJour = await tx.emprunt.update({
        where: { id: empruntId },
        data: { statut: StatutEmprunt.RETOURNE, dateRetour: dateFinReel },
      });

      await tx.livre.update({
        where: { id: emprunt.livreId },
        data: { stock: { increment: 1 } },
      });
      let message = 'Livre retourné.';

      // Gamification
      if (!estEnRetard) {
        const pointsGagnes = 10;
        const xpGagne = 10;
        const nouvelXpTotal = (emprunt.utilisateur.xp ?? 0) + xpGagne;
        await tx.utilisateur.update({
          where: { id: etudiantId },
          data: {
            pointsActuels: { increment: pointsGagnes },
            xp: nouvelXpTotal,
            niveau: this.calculerNiveau(nouvelXpTotal),
          },
        });
        message += ` +${pointsGagnes} Points et +${xpGagne} XP !`;
      } else {
        const joursRetard = Math.ceil(
          (dateFinReel.getTime() - emprunt.dateEcheance.getTime()) /
            (1000 * 3600 * 24),
        );

        if (bonusApplique) {
          message += ` Retard de ${joursRetard} jour(s) annulé par le bouclier de l'étudiant !`;
        } else {
          const penalite = joursRetard * 5;
          await tx.utilisateur.update({
            where: { id: etudiantId },
            data: {
              pointsActuels: Math.max(
                0,
                (emprunt.utilisateur.pointsActuels ?? 0) - penalite,
              ),
            },
          });
          await tx.sanction.create({
            data: {
              utilisateurId: etudiantId,
              raison: `Retard de ${joursRetard} jour(s)`,
              penalitePoints: penalite,
              dureeBlocage: joursRetard,
            },
          });
          message += ` Pénalité de -${penalite} points et compte bloqué.`;
        }
      }
      return { message, emprunt: empruntMisAJour };
    });

    try {
      const verificationBadges =
        await this.badgesService.verifierEtAttribuerBadges(etudiantId);

      if (
        verificationBadges.nouveauxBadges &&
        verificationBadges.nouveauxBadges.length > 0
      ) {
        const nomsBadges = verificationBadges.nouveauxBadges
          .map((b) => b.badge.nom)
          .join(', ');
        resultatTransaction.message += ` 🏆 Félicitations ! L'étudiant a débloqué de nouveaux badges : ${nomsBadges} !`;
      }
    } catch (error) {
      console.error("Erreur lors de l'attribution des badges:", error);
    }

    return resultatTransaction;
  }

  // OUTIL : CALCUL DU NIVEAU
  private calculerNiveau(xpTotal: number): number {
    const PALIERS = [
      { niveau: 10, xpMin: 4000 },
      { niveau: 9, xpMin: 2500 },
      { niveau: 8, xpMin: 1700 },
      { niveau: 7, xpMin: 1200 },
      { niveau: 6, xpMin: 800 },
      { niveau: 5, xpMin: 500 },
      { niveau: 4, xpMin: 300 },
      { niveau: 3, xpMin: 150 },
      { niveau: 2, xpMin: 50 },
      { niveau: 1, xpMin: 0 },
    ];
    const palier = PALIERS.find((p) => xpTotal >= p.xpMin);
    return palier ? palier.niveau : 1;
  }
}
