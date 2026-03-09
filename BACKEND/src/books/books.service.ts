import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { RoleUtilisateur } from '@prisma/client';
import { User } from 'src/users/entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService){}

  async create(data: CreateBookDto, user: any) {
    if (user.role !== RoleUtilisateur.ADMIN) {
      throw new ForbiddenException("Vous n'avez pas le droit d'ajouter un livre");
    }
    console.log('====================================');
    console.log('user',user);
    console.log('====================================');
    const existingBook = await this.prisma.livre.findUnique({
      where: { isbn: data.isbn }
    });

    if (existingBook) {
      throw new BadRequestException("Un livre avec cet ISBN existe déjà");
    }

    // Vérifier que la catégorie existe
    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId }
    });

    if (!category) {
      throw new BadRequestException("La catégorie spécifiée n'existe pas");
    }

    const book = await this.prisma.livre.create({
      data: {
        titre: data.titre,
        auteur: data.auteur,
        isbn: data.isbn,
        stock: data.stock ?? 3,
        categoryId: data.categoryId,
      },
      include: {
        category: true,
      }
    });

    return book;
  }

  async findAll() {
    return await this.prisma.livre.findMany({
      include: {
        category: true,
      }
    });
  }

  async findOne(id: number) {
    const book = await this.prisma.livre.findUnique({
      where: { id: id },
      include: {
        category: true,
      }
    });

    if (!book) {
      throw new NotFoundException(`Livre avec l'ID ${id} introuvable`);
    }

    return book;
  }

  async update(id: number, data: UpdateBookDto, user: any) {
    if (user.role !== RoleUtilisateur.ADMIN) {
      throw new ForbiddenException("Vous n'avez pas le droit de modifier un livre");
    }

    const book = await this.prisma.livre.findUnique({
      where: { id: id }
    });

    if (!book) {
      throw new NotFoundException('Livre introuvable');
    }

    // Si categoryId est fourni, vérifier qu'elle existe
    if (data.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: data.categoryId }
      });

      if (!category) {
        throw new BadRequestException("La catégorie spécifiée n'existe pas");
      }
    }

    const updatedBook = await this.prisma.livre.update({
      where: { id: id },
      data: {
        ...data
      },
      include: {
        category: true,
      }
    });

    return updatedBook;
  }

  async remove(id: number, user: any) {
    if (user.role !== RoleUtilisateur.ADMIN) {
      throw new ForbiddenException("Vous n'avez pas le droit de supprimer un livre");
    }

    const book = await this.prisma.livre.findUnique({
      where: { id: id }
    });

    if (!book) {
      throw new NotFoundException('Livre introuvable');
    }

    await this.prisma.livre.delete({
      where: { id: id }
    });

    return { message: `Livre "${book.titre}" supprimé avec succès` };
  }
}
