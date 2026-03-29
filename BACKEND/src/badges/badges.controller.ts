import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Request,
} from '@nestjs/common';
import { BadgesService } from './badges.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtUser } from 'src/auth/interfaces/jwt-user.interface';
import { Request as ExpressRequest } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Post()
  @Roles('ADMIN')
  create(
    @Body() createBadgeDto: CreateBadgeDto,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    return this.badgesService.create(createBadgeDto, req.user);
  }

  @Get()
  findAll() {
    return this.badgesService.findAll();
  }

  @Get('mes-badges')
  @Roles('ETUDIANT')
  getMesBadges(@Request() req: ExpressRequest & { user: JwtUser }) {
    return this.badgesService.getMesBadges(req.user);
  }

  @Get(':id')
  @Roles('ADMIN')
  findOne(
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    return this.badgesService.findOne(+id, req.user);
  }

  @Put(':id')
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() updateBadgeDto: UpdateBadgeDto,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    return this.badgesService.update(+id, updateBadgeDto, req.user);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    return this.badgesService.remove(+id, req.user);
  }
}
