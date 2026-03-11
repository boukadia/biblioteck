import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Put, UseGuards } from '@nestjs/common';
import { SanctionsService } from './sanctions.service';
import { AppliquerSanctionDto } from './dto/appliquerSanction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('sanctions')
export class SanctionsController {
  constructor(private readonly sanctionsService: SanctionsService) {}

  @Post()
  @Roles("ADMIN")
  create(@Body() data: AppliquerSanctionDto , @Request() req : any) {
    return this.sanctionsService.appliquerSanction(data,req.user);
  }
}
