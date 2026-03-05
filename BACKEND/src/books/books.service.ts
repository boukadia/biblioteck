import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { RoleUtilisateur } from '@prisma/client';
import { User } from 'src/users/entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService){}
 async  create(data: CreateBookDto) {
    // if(user.role !== RoleUtilisateur.ADMIN)
    // {throw new BadRequestException("Vous n'avez pas le droit d'ajouter un livre")}
    const existinBook = await this.prisma.livre.findUnique({
      where:{isbn:data.isbn}
    })

    if (existinBook){
      throw new BadRequestException("Un livre avec cet ISBN existe déjà")
    }

    const book=await this.prisma.livre.create({
      data: {
        ...data
      }
    })

    return book;
    
    
  }

  async findAll() {
    return await this.prisma.livre.findMany()

  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
