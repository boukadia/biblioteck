import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateRecompenseDto } from './dto/create-shop.dto';
import { UpdateRecompenseDto } from './dto/update-shop.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() createShopDto: CreateRecompenseDto, @Request() req: any) {
    return this.shopService.create(createShopDto, req.user);
  }

  @Get()
  findAll() {
    return this.shopService.findAll();
  }

  @Get('mes-bonus')
  @Roles('ETUDIANT')
  getMesBonus(@Request() req: any) {
    return this.shopService.getMesBonus(req.user);
  }

  @Post(':id/acheter')
  @Roles('ETUDIANT')
  acheterRecompense(@Param('id') id: string, @Request() req: any) {
    return this.shopService.acheterRecompense(+id, req.user);
  }

  @Get(':id')
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.shopService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateShopDto: UpdateRecompenseDto, @Request() req: any) {
    return this.shopService.update(+id, updateShopDto, req.user);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.shopService.remove(+id, req.user);
  }
}