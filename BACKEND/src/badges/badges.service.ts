import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { RoleUtilisateur } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BadgesService {
    constructor(private readonly prisma: PrismaService){}
  async create(data: CreateBadgeDto,user) {
    if (user.role!==RoleUtilisateur.ADMIN) {
        throw new BadRequestException("Vous n'avez pas le droit d'ajouter un Badge")
    }
    
    const badge= await this.prisma.badge.findFirst({
      where : {nom: data.nom}
    })
    if (badge) {
        throw new BadRequestException("ce badge est exist choisir un autre nom")
    }
    
    return await this.prisma.badge.create({data});
  }

  async findAll() {
    return await this.prisma.badge.findMany() ;
  }

  async findOne(id: number,user) {
    if (user.role!==RoleUtilisateur.ADMIN) {
        throw new BadRequestException("Vous n'avez pas le droit d'ajouter un Badge")
    }
    const badge =await this.prisma.badge.findUnique({
      where:{
        id: id
      }
    })
     if (!badge) {
       throw new NotFoundException("ce badge n'est exist pas")
    }
    return badge ;
  }

  async  update(id: number, data: UpdateBadgeDto,user) {
    if (user.role!==RoleUtilisateur.ADMIN) {
        throw new BadRequestException("Vous n'avez pas le droit d'ajouter un Badge")
    }
    const badge =await this.prisma.badge.findUnique({
      where:{
        id: id
      }
    })
    if (!badge) {
       throw new NotFoundException("ce badge n'est exist pas")
    }
    const updatedBadge= await this.prisma.badge.update({
      where: {id:id},
      data:{
        ...data
      }
    })
    
    return updatedBadge ;
  }

  async remove(id: number,user) {
    if (user.role!==RoleUtilisateur.ADMIN) {
        throw new BadRequestException("Vous n'avez pas le droit d'ajouter un Badge")
    }
     const badge =await this.prisma.badge.findUnique({
      where:{
        id: id
      }
    })

    if (!badge) {
       throw new NotFoundException("ce badge n'est exist pas")
    }
    const deletedBadge= await this.prisma.badge.delete({
      where:{
        id:id
      }
    })
     
    return deletedBadge ;
  }
}
