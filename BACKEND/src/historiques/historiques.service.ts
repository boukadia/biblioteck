import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleUtilisateur } from '@prisma/client';
import { JwtUser } from 'src/auth/interfaces/jwt-user.interface';

@Injectable()
export class HistoriquesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user: JwtUser) {
    if (user.role === RoleUtilisateur.ADMIN) {
      return this.prisma.historiquePoints.findMany({
        orderBy: { dateMouvement: 'desc' },
        include: {
          utilisateur: { select: { id: true, nom: true, email: true } },
        },
      });
    }

    return this.prisma.historiquePoints.findMany({
      where: { utilisateurId: user.userId },
      orderBy: { dateMouvement: 'desc' },
    });
  }

  async findByEtudiant(utilisateurId: number, user: JwtUser) {
    if (user.role !== RoleUtilisateur.ADMIN && user.userId !== utilisateurId) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à consulter cet historique",
      );
    }

    const etudiant = await this.prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      select: {
        id: true,
        nom: true,
        email: true,
        pointsActuels: true,
        niveau: true,
      },
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

  async findOne(id: number, user: JwtUser) {
    const entry = await this.prisma.historiquePoints.findUnique({
      where: { id },
      include: {
        utilisateur: { select: { id: true, nom: true, email: true } },
      },
    });

    if (!entry) {
      throw new NotFoundException(`Entrée historique #${id} introuvable`);
    }

    if (
      user.role !== RoleUtilisateur.ADMIN &&
      user.userId !== entry.utilisateurId
    ) {
      throw new UnauthorizedException('Accès non autorisé');
    }

    return entry;
  }
}
