import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRecompenseDto } from './dto/create-shop.dto';
import { UpdateRecompenseDto } from './dto/update-shop.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleUtilisateur, TypeMouvementPoints } from '@prisma/client';
import { JwtUser } from 'src/auth/interfaces/jwt-user.interface';

@Injectable()
export class ShopService {
  constructor(private readonly prisma: PrismaService) {}

  // PARTIE ADMIN : GESTION DU CATALOGUE

  async create(data: CreateRecompenseDto, user: JwtUser) {
    if (user.role !== RoleUtilisateur.ADMIN) {
      throw new ForbiddenException('Seul un admin peut créer une récompense.');
    }
    return this.prisma.recompense.create({
      data: { ...data, description: data.description ?? '' },
    });
  }

  async findAll() {
    return this.prisma.recompense.findMany({
      orderBy: { cout: 'asc' },
    });
  }

  async findOne(id: number) {
    const recompense = await this.prisma.recompense.findUnique({
      where: { id },
    });
    if (!recompense) throw new NotFoundException('Récompense introuvable.');
    return recompense;
  }

  async update(id: number, data: UpdateRecompenseDto, user: JwtUser) {
    if (user.role !== RoleUtilisateur.ADMIN) {
      throw new ForbiddenException('Accès refusé.');
    }
    await this.findOne(id);
    return this.prisma.recompense.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, user: JwtUser) {
    if (user.role !== RoleUtilisateur.ADMIN)
      throw new ForbiddenException('Accès refusé.');
    await this.findOne(id);
    return this.prisma.recompense.delete({ where: { id } });
  }

  // PARTIE ÉTUDIANT : ACHAT DE BONUS

  async acheterRecompense(recompenseId: number, user: JwtUser) {
    const recompense = await this.prisma.recompense.findUnique({
      where: { id: recompenseId },
    });

    if (!recompense) {
      throw new NotFoundException("Cette récompense n'existe pas.");
    }

    const etudiant = await this.prisma.utilisateur.findUnique({
      where: { id: user.userId },
      select: { id: true, pointsActuels: true },
    });

    if (!etudiant) {throw new NotFoundException('Utilisateur introuvable.');}

    if ((etudiant.pointsActuels ?? 0) < recompense.cout) {
      throw new BadRequestException(
        `Solde insuffisant. Il vous faut ${recompense.cout} points.`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const nouveauxPoints = (etudiant.pointsActuels ?? 0) - recompense.cout;
      await tx.utilisateur.update({
        where: { id: etudiant.id },
        data: { pointsActuels: nouveauxPoints },
      });

      const dateExpiration = new Date();
      dateExpiration.setDate(dateExpiration.getDate() + (recompense.dureeValiditeJours || 60));

      const nouveauBonus = await tx.bonusPossede.create({
        data: {
          utilisateurId: etudiant.id,
          recompenseId: recompense.id,
          dateExpiration: dateExpiration,
          estConsomme: false,
        },
        include: { recompense: true },
      });

      await tx.historiquePoints.create({
        data: {
          utilisateurId: etudiant.id,
          montant: -recompense.cout,
          type: 'ACHAT_BOUTIQUE',
          description: `Achat du bonus: ${recompense.type}`,
        },
      });

      return {
        message: 'Achat réussi ! Le bonus a été ajouté à votre inventaire.',
        nouveauxPoints: nouveauxPoints,
        bonus: nouveauBonus,
      };
    });
  }

  async getMesBonus(user: JwtUser) {
    return this.prisma.bonusPossede.findMany({
      where: {
        utilisateurId: user.userId,
        estConsomme: false,
      },
      include: { recompense: true },
      orderBy: { dateExpiration: 'asc' },
    });
  }
}
