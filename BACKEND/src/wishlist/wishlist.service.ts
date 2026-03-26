import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtUser } from 'src/auth/interfaces/jwt-user.interface';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async ajouterLivre(createWishlistDto: CreateWishlistDto, user: JwtUser) {
    const { livreId } = createWishlistDto;

    const livre = await this.prisma.livre.findUnique({
      where: { id: livreId },
    });

    if (!livre) {
      throw new NotFoundException("Ce livre n'existe pas.");
    }

    const existeDeja = await this.prisma.listeSouhaits.findFirst({
      where: {
        utilisateurId: user.userId,
        livreId: livreId,
      },
    });

    if (existeDeja) {
      throw new BadRequestException("Ce livre est déjà dans votre liste de souhaits.");
    }

    const wishlistItem = await this.prisma.listeSouhaits.create({
      data: {
        utilisateurId: user.userId,
        livreId: livreId,
      },
      include: {
        livre: {
          select: { id: true, titre: true, auteur: true, image: true, stock: true },
        },
      },
    });

    return {
      message: "Livre ajouté à votre liste de souhaits avec succès.",
      item: wishlistItem,
    };
  }

  async getMaListe(user: JwtUser) {
    return this.prisma.listeSouhaits.findMany({
      where: {
        utilisateurId: user.userId,
      },
      include: {
        livre: {
          select: { id: true, titre: true, auteur: true, image: true, stock: true },
        },
      },
      orderBy: {
        dateAjout: 'desc', 
      },
    });
  }
 

  async retirerLivre(livreId: number, user: JwtUser) {
    const wishlistItem = await this.prisma.listeSouhaits.findFirst({
      where: {
        utilisateurId: user.userId,
        livreId: livreId,
      },
    });

    if (!wishlistItem) {
      throw new NotFoundException("Ce livre n'est pas dans votre liste de souhaits.");
    }

    await this.prisma.listeSouhaits.delete({
      where: {
        id: wishlistItem.id,
      },
    });

    return {
      message: "Livre retiré de votre liste de souhaits.",
    };
  }
}