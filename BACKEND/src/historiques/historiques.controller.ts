import {
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { HistoriquesService } from './historiques.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtUser } from 'src/auth/interfaces/jwt-user.interface';
import { Request as ExpressRequest } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('historiques')
export class HistoriquesController {
  constructor(private readonly historiquesService: HistoriquesService) {}

  @Get()
  @Roles('ADMIN', 'ETUDIANT')
  findAll(@Request() req: ExpressRequest & { user: JwtUser }) {
    return this.historiquesService.findAll(req.user);
  }

  @Get('etudiant/:id')
  @Roles('ADMIN', 'ETUDIANT')
  findByEtudiant(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    return this.historiquesService.findByEtudiant(id, req.user);
  }

  @Get(':id')
  @Roles('ADMIN', 'ETUDIANT')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    return this.historiquesService.findOne(id, req.user);
  }
}
