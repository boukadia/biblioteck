import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateRegleSanctionDto } from './dto/create-regle-sanction.dto';
import { UpdateRegleSanctionDto } from './dto/update-regle-sanction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleUtilisateur } from '@prisma/client';

@Injectable()
export class RegleSanctionsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateRegleSanctionDto,user) {
    if(user.role !== RoleUtilisateur.ADMIN) {
      throw new UnauthorizedException('Vous n\'avez pas le droit de créer une règle de sanction');
    }
    const existing = await this.prisma.regleSanction.findUnique({
      where: { nomRegle: data.nomRegle }
    });

    if (existing) {
      throw new BadRequestException(`Une règle avec le nom "${data.nomRegle}" existe déjà`);
    }

    return await this.prisma.regleSanction.create({
      data
    });
  }

  async findAll(user) {
    if(user.role !== RoleUtilisateur.ADMIN) {
      throw new UnauthorizedException('Vous n\'avez pas le droit de créer une règle de sanction');
    }
    return await this.prisma.regleSanction.findMany();
  }

  async findOne(id: number,user) {
    if(user.role !== RoleUtilisateur.ADMIN) {
      throw new UnauthorizedException('Vous n\'avez pas le droit de créer une règle de sanction');
    }
    const regle = await this.prisma.regleSanction.findUnique({
      where: { id }
    });

    if (!regle) {
      throw new NotFoundException(`Règle de sanction avec l'ID ${id} introuvable`);
    }

    return regle;
  }

  async update(id: number, data: UpdateRegleSanctionDto,user) {
    if(user.role !== RoleUtilisateur.ADMIN) {
      throw new UnauthorizedException('Vous n\'avez pas le droit de créer une règle de sanction');
    }

    if (data.nomRegle) {
      const existing = await this.prisma.regleSanction.findFirst({
        where: {
          nomRegle: data.nomRegle,
          NOT: { id }
        }
      });

      if (existing) {
        throw new BadRequestException(`Une règle avec le nom "${data.nomRegle}" existe déjà`);
      }
    }

    return await this.prisma.regleSanction.update({
      where: { id },
      data:{
        ...data
      }
    });
  }

  async remove(id: number,user) {
    if(user.role !== RoleUtilisateur.ADMIN) {
      throw new UnauthorizedException('Vous n\'avez pas le droit de créer une règle de sanction');
    }
    
    const regle = await this.prisma.regleSanction.findFirst({
      where: {
        id:id
      }
    });
    if (!regle) {
      throw new NotFoundException(`Règle de sanction avec l'ID ${id} introuvable`);
    }

    await this.prisma.regleSanction.delete({
      where: { id }
    });

    return { message: `Règle de sanction "${regle.nomRegle}" supprimée avec succès` };
  }
}
