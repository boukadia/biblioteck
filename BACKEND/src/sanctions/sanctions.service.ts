import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleUtilisateur, TypeMouvementPoints } from '@prisma/client';
import { AppliquerSanctionDto } from './dto/appliquerSanction.dto';
import { JwtUser } from 'src/auth/interfaces/jwt-user.interface';

@Injectable()
export class SanctionsService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(user: JwtUser) {
    if (user.role !== RoleUtilisateur.ADMIN) {
      throw new UnauthorizedException(
        "Vous n'avez pas le droit de consulter les sanctions",
      );
    }
    return this.prisma.sanction.findMany({
      include: {
        utilisateur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            pointsActuels: true,
            statut: true,
          },
        },
      },
      orderBy: { dateCreation: 'desc' },
    });
  }

  async appliquerSanction(data: AppliquerSanctionDto, user: JwtUser) {
    if (user.role !== RoleUtilisateur.ADMIN) {
      throw new UnauthorizedException(
        "vous n'avais pas le droit du creer la sanction",
      );
    }
    const etudiant = await this.prisma.utilisateur.findUnique({
      where: {
        id: data.utilisateurId,
      },
    });
    if (!etudiant) {
      throw new BadRequestException("l'etudiant n'a pas été trouvé");
    }
    if (etudiant.role !== RoleUtilisateur.ETUDIANT) {
      throw new BadRequestException("l'utilisateur n'est pas un etudiant");
    }
    const regle = await this.prisma.regleSanction.findUnique({
      where: {
        id: data.regleId,
      },
    });
    if (!regle) {
      throw new BadRequestException("la regle n'a pas été trouvé");
    }

    return this.prisma.$transaction(async (tx) => {
      const nouvelleSanction = await tx.sanction.create({
        data: {
          dureeBlocage: regle.dureeBlocage,
          penalitePoints: regle.penalitePoints,
          raison: regle.description || '',
          utilisateurId: etudiant.id,
        },
      });
      const nouveauxPoints = Math.max(
        0,
        (etudiant.pointsActuels ?? 0) - regle.penalitePoints,
      );
      await tx.utilisateur.update({
        where: {
          id: data.utilisateurId,
        },
        data: {
          pointsActuels: nouveauxPoints,
        },
      });

      await tx.historiquePoints.create({
        data: {
          utilisateurId: etudiant.id,
          montant: -regle.penalitePoints,
          type: TypeMouvementPoints.SANCTION_ADMIN,
          description: `Sanction appliquée : ${regle.nomRegle}`,
        },
      });

      return {
        message: 'Sanction appliquée avec succès.',
        sanction: nouvelleSanction,
        nouveauxPointsUtilisateur: nouveauxPoints,
      };
    });
  }
}
