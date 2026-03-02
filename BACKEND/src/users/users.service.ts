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
    // if (user.role!=="ADMIN") {
    //   throw BadRequestException("admin required");
    // }
    
    const users= this.prisma.utilisateur.findMany()
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
