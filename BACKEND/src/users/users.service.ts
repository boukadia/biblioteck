import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { log } from 'node:console';
import { Prisma } from 'src/prisma/entities/prisma.entity';
import { StatutUtilisateur } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor (private readonly prisma: PrismaService){}


  findAll() {
    const users= this.prisma.utilisateur.findMany(
      {
        select: {
          id:true,
          nom:true,
          email:true,
          statut:true,
          role:true,
          xp:true,
          niveau:true,
          pointsActuels:true
        }
      }
    )
    return  users;
  }
  async changeStatus(id: number) {
    const user =await this.prisma.utilisateur.findUnique({where:{
      id:id
    }})
    if (!user) {
    throw new BadRequestException("user not found")
    }
   if (user.statut=== StatutUtilisateur.ACTIF) {
    const updatedUser=await this.prisma.utilisateur.update({
      where:{
        id: id
      },
      data: {
        statut:'BLOQUE',
      }
    })
     return updatedUser
    }
    else {
      const updatedUser=await this.prisma.utilisateur.update({
        where:{
          id:id
        },
        data:{
          statut:'ACTIF'
        },

      })
      return updatedUser
      

   
  }
  }

  async findOne(id: number) {
    const user= await this.prisma.utilisateur.findFirst({
      where: {
        id:id
      },
      select: {
        id:true,
        nom:true,
        email:true,
        statut:true,
        role:true,
        xp:true,
        niveau:true,
        pointsActuels:true

      }
    })
    return user ;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
