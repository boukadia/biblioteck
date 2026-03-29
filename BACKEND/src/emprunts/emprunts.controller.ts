import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EmpruntsService } from './emprunts.service';
import { CreateEmpruntDto } from './dto/create-emprunt.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtUser } from 'src/auth/interfaces/jwt-user.interface';
import { DeclarerRetourDto } from './dto/declarer.retour.dto';
import { ProlongerEmpruntDto } from './dto/prolonger-emprunt.dto';
import { Request as ExpressRequest } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('emprunts')
export class EmpruntsController {
  constructor(private readonly empruntsService: EmpruntsService) {}

  @Post()
  @Roles('ETUDIANT')
  emprunterLivre(
    @Body() createEmpruntDto: CreateEmpruntDto,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    return this.empruntsService.emprunterLivre(createEmpruntDto, req.user);
  }
  @Get('all')
  @Roles('ADMIN')
  getAllEmprunts() {
    return this.empruntsService.findAll();
  }

  @Get('en-attente')
  @Roles('ADMIN')
  getEnAttente() {
    return this.empruntsService.getEmpruntsEnAttente();
  }

  @Get('en-cours')
  @Roles('ADMIN')
  getEnCours() {
    return this.empruntsService.getEmpruntsEnCours();
  }
  @Get('en-retard')
  @Roles('ADMIN')
  getRetard() {
    return this.empruntsService.getEmpruntsEnRetard();
  }

  @Get('en-attente-retour')
  @Roles('ADMIN')
  getEnAttenteRetour() {
    return this.empruntsService.getEmpruntsEnAttenteRetour();
  }

  @Patch(':id/valider')
  @Roles('ADMIN')
  validerEmprunt(@Param('id') id: number) {
    return this.empruntsService.validerEmprunt(id);
  }
  @Patch(':id/retour')
  @Roles('ADMIN')
  retourner(@Param('id') id: number) {
    return this.empruntsService.retournerLivre(id);
  }

  @Patch(':id/declarer-retour')
  @Roles('ETUDIANT')
  declarerRetour(
    @Param('id') id: number,
    @Request() req: ExpressRequest & { user: JwtUser },
    @Body() declarerRetourDto: DeclarerRetourDto,
  ) {
    return this.empruntsService.declarerRetour(
      req.user,
      id,
      declarerRetourDto.bonusProtectionId,
    );
  }

  @Patch(':id/annuler')
  @Roles('ADMIN')
  annuler(@Param('id') id: number) {
    return this.empruntsService.annulerEmprunt(id);
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.empruntsService.findAll();
  }

  @Get('mes-emprunts')
  @Roles('ETUDIANT')
  findMesEmprunts(@Request() req: ExpressRequest & { user: JwtUser }) {
    return this.empruntsService.findMesEmprunts(req.user);
  }

  @Patch(':id/prolonger')
  @Roles('ETUDIANT')
  prolonger(
    @Param('id') id: number,
    @Request() req: ExpressRequest & { user: JwtUser },
    @Body() prolongerDto: ProlongerEmpruntDto,
  ) {
    return this.empruntsService.prolongerEmprunt(
      req.user,
      id,
      prolongerDto.bonusPossedeId,
    );
  }
}
