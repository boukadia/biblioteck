import { Injectable } from '@nestjs/common';
import { CreateSanctionDto } from './dto/create-sanction.dto';
import { UpdateSanctionDto } from './dto/update-sanction.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SanctionsService {
  constructor(private readonly prisma: PrismaService){}
  create(data: CreateSanctionDto,user) {
    
    return 
  }

  findAll(user) {
    return 
  }

  findOne(id: number,user) {
    return 
  }

  update(id: number, data: UpdateSanctionDto,user) {
    return 
  }

  remove(id: number,user) {
    return 
  }
}
