import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { EmpruntsService } from './emprunts.service';
import { CreateEmpruntDto } from './dto/create-emprunt.dto';
import { UpdateEmpruntDto } from './dto/update-emprunt.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';


@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('emprunts')
export class EmpruntsController {
  constructor(private readonly empruntsService: EmpruntsService) {}

  @Post()
  create(@Body() createEmpruntDto: CreateEmpruntDto,@Request() req: any) {
    return this.empruntsService.emprunterLivre(createEmpruntDto,req.user);
  }

  @Get()
  findAll() {
    return this.empruntsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.empruntsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmpruntDto: UpdateEmpruntDto) {
    return this.empruntsService.update(+id, updateEmpruntDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.empruntsService.remove(+id);
  }
}
