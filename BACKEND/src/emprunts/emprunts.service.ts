import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmpruntDto } from './dto/create-emprunt.dto';
import { UpdateEmpruntDto } from './dto/update-emprunt.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmpruntsService {
  constructor(private readonly prisma:PrismaService) { }
  async emprunterLivre(data: CreateEmpruntDto,user: any) {
    const livre=await this.prisma.livre.findUnique({
      where: {
        id:data.livreId
      }
    })
    if (!livre) {
      throw new NotFoundException("Le livre demandé n'existe pas.");
    }
    if (livre.stock<=0) {
      throw new BadRequestException("Ce livre est en rupture de stock.");
    }
   
   const dernierSanction= await this.prisma.sanction.findFirst({
    where:{
      utilisateurId:user.userId
    },
    orderBy:{
      dateCreation:"desc"
    } 
   })
   if (dernierSanction && dernierSanction.dureeBlocage>0) {
    const dateFinBlocage=new Date(dernierSanction.dateCreation)
    dateFinBlocage.setDate(dateFinBlocage.getDate() + dernierSanction.dureeBlocage)
    if(new Date() <dateFinBlocage){
      throw new ForbiddenException(`Vous êtes bloqué jusqu'au ${dateFinBlocage.toLocaleDateString()} suite à une sanction.`);
    }
   }
   const empruntesEnCours= await this.prisma.emprunt.count({
    where:{
      utilisateurId:user.userId,
      dateRetour:null
    }
   })
   
return 1

  }

  findAll() {
    return `This action returns all emprunts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} emprunt`;
  }

  update(id: number, updateEmpruntDto: UpdateEmpruntDto) {
    return `This action updates a #${id} emprunt`;
  }

  remove(id: number) {
    return `This action removes a #${id} emprunt`;
  }
}
