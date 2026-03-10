import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleUtilisateur } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma:PrismaService){}
  async create(data: CreateCategoryDto,user) {
     if (user.role !== RoleUtilisateur.ADMIN) {
          throw new ForbiddenException("Vous n'avez pas le droit d'ajouter une categorie");
        }
    const category=await this.prisma.category.findFirst({
      where:{
        name: data.name
      }
    })
    if(category){
      throw new BadRequestException("category already exists")
    }

    return this.prisma.category.create({
      data:{
        ...data
      }
    })
  }

  async findAll() {
    return await this.prisma.category.findMany() ;
  }

  async findOne(id: number,user) {
     if(user.role!==RoleUtilisateur.ADMIN) {
      throw new BadRequestException("Vous n'avez pas le droit d'acceder a une categorie")
    }
    const category= await this.prisma.category.findFirst({
      where:{
        id:id
      }
    })
    return category ;
  }

  async update(id: number, data: UpdateCategoryDto,user) {
    if (user.role!==RoleUtilisateur.ADMIN) {
      throw new BadRequestException("Vous n'avez pas le droit du modifier une categorie")
    }
    const categorie = await this.prisma.category.update({
      where: {
        id:id
      },
      data:{
        ...data
      }
    })
    return categorie
  }

  async remove(id: number,user) {
     if (user.role!==RoleUtilisateur.ADMIN) {
      throw new BadRequestException("Vous n'avez pas le droit du modifier une categorie")
    }
    const categorie= await this.prisma.category.delete({
      where:{
        id: id
      }
    });
    return categorie;
  }
}
