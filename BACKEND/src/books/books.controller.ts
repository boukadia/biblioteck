import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('books')
export class BooksController {
    constructor(private readonly bookService : BooksService){}

    @Post('')
    // @Roles('ADMIN')
    create(@Body() data: CreateBookDto, @Request() req){
        return this.bookService.create(data, req.user)
    }

    @Get('')
    findAll(){
        return this.bookService.findAll()
    }
    
    @Get(':id')
    findOne(@Param('id') id: string){
        return this.bookService.findOne(+id)
    }

    @Put(':id')
    @Roles('ADMIN')
    update(@Param('id') id: string, @Body() data: UpdateBookDto, @Request() req){
        return this.bookService.update(+id, data, req.user)
    }

    @Delete(':id')
    @Roles('ADMIN')
    remove(@Param('id') id: string, @Request() req){
        return this.bookService.remove(+id, req.user)
    }
}
