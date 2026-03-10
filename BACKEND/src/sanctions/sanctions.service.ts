import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSanctionDto } from './dto/create-sanction.dto';
import { UpdateSanctionDto } from './dto/update-sanction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleUtilisateur } from '@prisma/client';

@Injectable()
export class SanctionsService {
  constructor(private readonly prisma: PrismaService){}
  async create(data: CreateSanctionDto,user) {
    if(user.role!==RoleUtilisateur.ADMIN){
      throw new BadRequestException("vous n'avais pas le droit du creer la sanction")
    }
    const sanction= await this.prisma.sanction.findFirst({
      where: {
        
      }
    })
    
    return 
  }

  async findAll(user) {
    return 
  }

  async findOne(id: number,user) {
    return 
  }

  async update(id: number, data: UpdateSanctionDto,user) {
    return 
  }

  async remove(id: number,user) {
    return 
  }
}
