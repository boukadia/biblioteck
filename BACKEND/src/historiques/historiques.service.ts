import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleUtilisateur } from '@prisma/client';

@Injectable()
export class HistoriquesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user: any) {
    if (user.role === RoleUtilisateur.ADMIN) {
      return this.prisma.historiquePoints.findMany({
        orderBy: { dateMouvement: 'desc' },
        include: {
          utilisateur: { select: { id: true, nom: true, email: true } },
        },
      });
    }

    return this.prisma.historiquePoints.findMany({
      where: { utilisateurId: user.id },
      orderBy: { dateMouvement: 'desc' },
    });
  }

  
  async findByEtudiant(utilisateurId: number, user: any) {
    if (user.role !== RoleUtilisateur.ADMIN && user.id !== utilisateurId) {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à consulter cet historique");
    }

    const etudiant = await this.prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      select: { id: true, nom: true, email: true, pointsActuels: true, niveau: true },
    });
    if (!etudiant) {
      throw new NotFoundException(`Utilisateur #${utilisateurId} introuvable`);
    }

    const historique = await this.prisma.historiquePoints.findMany({
      where: { utilisateurId },
      orderBy: { dateMouvement: 'desc' },
    });

    

    return { etudiant, historique };
  }

  
  async findOne(id: number, user: any) {
    const entry = await this.prisma.historiquePoints.findUnique({
      where: { id },
      include: {
        utilisateur: { select: { id: true, nom: true, email: true } },
      },
    });

    if (!entry) {
      throw new NotFoundException(`Entrée historique #${id} introuvable`);
    }

    if (user.role !== RoleUtilisateur.ADMIN && user.id !== entry.utilisateurId) {
      throw new UnauthorizedException("Accès non autorisé");
    }

    return entry;
  }
  
}
