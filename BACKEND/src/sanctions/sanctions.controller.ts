import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SanctionsService } from './sanctions.service';
import { CreateSanctionDto } from './dto/create-sanction.dto';
import { UpdateSanctionDto } from './dto/update-sanction.dto';

@Controller('sanctions')
export class SanctionsController {
  constructor(private readonly sanctionsService: SanctionsService) {}

  @Post()
  create(@Body() createSanctionDto: CreateSanctionDto) {
    return this.sanctionsService.create(createSanctionDto);
  }

  @Get()
  findAll() {
    return this.sanctionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.sanctionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSanctionDto: UpdateSanctionDto) {
    return this.sanctionsService.update(+id, updateSanctionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sanctionsService.remove(+id);
  }
}
