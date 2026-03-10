import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Put, UseGuards } from '@nestjs/common';
import { SanctionsService } from './sanctions.service';
import { CreateSanctionDto } from './dto/create-sanction.dto';
import { UpdateSanctionDto } from './dto/update-sanction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('sanctions')
export class SanctionsController {
  constructor(private readonly sanctionsService: SanctionsService) {}

  @Post()
  @Roles("ADMIN")
  create(@Body() data: CreateSanctionDto, @Request() req : any) {
    return this.sanctionsService.create(data,req.user);
  }

  @Get()
  @Roles("ADMIN")
  findAll(@Request() req : any) {
    return this.sanctionsService.findAll(req.user);
  }

  @Get(':id')
  @Roles("ADMIN")
  findOne(@Param('id') id: number,@Request() req : any) {
    return this.sanctionsService.findOne(+id,req.user);
  }

  @Put(':id')
  @Roles("ADMIN")
  update(@Param('id') id: string, @Body() updateSanctionDto: UpdateSanctionDto,@Request() req : any) {
    return this.sanctionsService.update(+id, updateSanctionDto,req.user);
  }

  @Delete(':id')
  @Roles("ADMIN")
  remove(@Param('id') id: string,@Request() req : any) {
    return this.sanctionsService.remove(+id,req.user);
  }
}
