import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { RegleSanctionsService } from './regle-sanctions.service';
import { CreateRegleSanctionDto } from './dto/create-regle-sanction.dto';
import { UpdateRegleSanctionDto } from './dto/update-regle-sanction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('regle-sanctions')
export class RegleSanctionsController {
  constructor(private readonly regleSanctionsService: RegleSanctionsService) { }

  @Post()
  @Roles('ADMIN')
  create(@Body() createRegleSanctionDto: CreateRegleSanctionDto,@Request() req: any) {
    return this.regleSanctionsService.create(createRegleSanctionDto,req.user);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.regleSanctionsService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string,@Request() req: any) {
    return this.regleSanctionsService.findOne(+id,req.user);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateRegleSanctionDto: UpdateRegleSanctionDto,@Request() req: any) {
    return this.regleSanctionsService.update(+id, updateRegleSanctionDto,req.user);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string,@Request() req: any) {
    return this.regleSanctionsService.remove(+id,req.user);
  }
}
