import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    //
    // if(users.role!== "ADMIN") {
    //   throw new BadRequestException("you don't have the right to access this resource")
    // }
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

  async update(id: number, updateUserDto: UpdateUserDto) {

    //  if(user.role!=="ADMIN" && user.id!==id ){
      // throw new NotFoundException("you don't have the right to access this resource")
    // }
    const user =await this.prisma.utilisateur.findUnique({
      where:{
        id:id
      }
    })
   

    if(!user){
      throw new BadRequestException("utilisateur not found")
    }
    const updatedUser=  await this.prisma.utilisateur.update({
      where:{
        id:id,
      },
      data: {
        ...updateUserDto
      }
    })
    return updateUserDto
  }

  async remove(id: number) {
    // if(user.role!=="ADMIN"){
    //   throw new NotFoundException("you don't have the right to access this resource")
    // }
    const user= await this.prisma.utilisateur.findFirst({where:{
      id:id
    }})
    if(!user){
      throw new BadRequestException(
        "user not found"
      )
    }
    await this.prisma.utilisateur.delete({
      where: {
        id:id
      }
    })
    return user;
  }
}
