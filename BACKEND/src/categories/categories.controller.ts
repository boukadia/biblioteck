import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtUser } from 'src/auth/interfaces/jwt-user.interface';
import { Request as ExpressRequest } from 'express';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    return this.categoriesService.create(createCategoryDto, req.user);
  }
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findOne(
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    return this.categoriesService.findOne(+id, req.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    return this.categoriesService.update(+id, updateCategoryDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    return this.categoriesService.remove(+id, req.user);
  }
}
