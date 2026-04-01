import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtUser } from 'src/auth/interfaces/jwt-user.interface';
import { Request as ExpressRequest } from 'express';

@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BooksService) {}
  @Post('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(
    @Body() data: CreateBookDto,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    return this.bookService.create(data, req.user);
  }

  @Get('')
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() data: UpdateBookDto,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    return this.bookService.update(+id, data, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    return this.bookService.remove(+id, req.user);
  }
}
