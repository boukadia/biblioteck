import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { RoleUtilisateur, StatutEmprunt } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtUser } from 'src/auth/interfaces/jwt-user.interface';

@Injectable()
export class BadgesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateBadgeDto, user) {
    if (user.role !== RoleUtilisateur.ADMIN) {
      throw new ForbiddenException(
        "Vous n'avez pas le droit d'ajouter un Badge",
      );
    }

    const badge = await this.prisma.badge.findFirst({
      where: { nom: data.nom },
    });
    if (badge) {
      throw new BadRequestException('ce badge est exist choisir un autre nom');
    }

    return await this.prisma.badge.create({ data });
  }

  async findAll() {
    return await this.prisma.badge.findMany();
  }

  async findOne(id: number, user) {
    if (user.role !== RoleUtilisateur.ADMIN) {
      throw new ForbiddenException(
        "Vous n'avez pas le droit d'ajouter un Badge",
      );
    }
    const badge = await this.prisma.badge.findUnique({
      where: {
        id: id,
      },
    });
    if (!badge) {
      throw new NotFoundException("ce badge n'est exist pas");
    }
    return badge;
  }

  async update(id: number, data: UpdateBadgeDto, user) {
    if (user.role !== RoleUtilisateur.ADMIN) {
      throw new ForbiddenException(
        "Vous n'avez pas le droit d'ajouter un Badge",
      );
    }
    const badge = await this.prisma.badge.findUnique({
      where: {
        id: id,
      },
    });
    if (!badge) {
      throw new NotFoundException("ce badge n'est exist pas");
    }
    const updatedBadge = await this.prisma.badge.update({
      where: { id: id },
      data: {
        ...data,
      },
    });

    return updatedBadge;
  }

  async remove(id: number, user) {
    if (user.role !== RoleUtilisateur.ADMIN) {
      throw new ForbiddenException(
        "Vous n'avez pas le droit d'ajouter un Badge",
      );
    }
    const badge = await this.prisma.badge.findUnique({
      where: {
        id: id,
      },
    });

    if (!badge) {
      throw new NotFoundException("ce badge n'est exist pas");
    }
    const deletedBadge = await this.prisma.badge.delete({
      where: {
        id: id,
      },
    });

    return deletedBadge;
  }

  async getMesBadges(user: JwtUser) {
   
    return this.prisma.badgeEtudiant.findMany({
      where: { utilisateurId: user.userId },
      include: {
        badge: true,
      },
      orderBy: { dateObtention: 'desc' },
    });
  }

  // SYSTÈME : Vérifier et attribuer les badges automatiquement
  async verifierEtAttribuerBadges(utilisateurId: number) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      select: { xp: true },
    });

    if (!utilisateur) return { nouveauxBadges: [] };

    const xpActuel = utilisateur.xp ?? 0;
    if (xpActuel === 0) {
      return { nouveauxBadges: [] };
    }

    const badgesMerites = await this.prisma.badge.findMany({
      where: { conditionXP: { lte: xpActuel } },
    });

    const badgesPossedes = await this.prisma.badgeEtudiant.findMany({
      where: { utilisateurId: utilisateurId },
      select: { badgeId: true },
    });
    const idsPossedes = badgesPossedes.map((b) => b.badgeId);

    const nouveauxBadges = badgesMerites.filter(
      (badge) => !idsPossedes.includes(badge.id),
    );

    const badgesAttribues: any[] = [];
    for (const badge of nouveauxBadges) {
      const nouveauBadgeEtudiant = await this.prisma.badgeEtudiant.create({
        data: {
          utilisateurId: utilisateurId,
          badgeId: badge.id,
        },
        include: { badge: true },
      });
      badgesAttribues.push(nouveauBadgeEtudiant);
    }

    return {
      nouveauxBadges: badgesAttribues,
    };
  }
}
