import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
@UseGuards(JwtAuthGuard,RolesGuard)

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() createCategoryDto: CreateCategoryDto,@Request() req: any) {
    return this.categoriesService.create(createCategoryDto,req.user);
  }
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN')
  findOne(@Param('id') id: string,@Request() req : any) {
    return this.categoriesService.findOne(+id,req.user);
  }

  @Put(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto,@Request() req: any) {
    return this.categoriesService.update(+id, updateCategoryDto,req.user);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string,@Request() req : any) {
    return this.categoriesService.remove(+id,req.user);
  }
}
