import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SanctionsService } from './sanctions.service';
import { AppliquerSanctionDto } from './dto/appliquerSanction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtUser } from 'src/auth/interfaces/jwt-user.interface';
import { Request as ExpressRequest } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sanctions')
export class SanctionsController {
  constructor(private readonly sanctionsService: SanctionsService) {}
  @Get()
  @Roles('ADMIN')
  findAll(@Request() req: ExpressRequest & { user: JwtUser }) {
    return this.sanctionsService.findAll(req.user);
  }

  @Post()
  @Roles('ADMIN')
  create(
    @Body() data: AppliquerSanctionDto,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    return this.sanctionsService.appliquerSanction(data, req.user);
  }
}
