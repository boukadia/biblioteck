import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
    constructor(private readonly bookService : BooksService){}
    @Post('')
    create( @Body() data: CreateBookDto){
        return this.bookService.create(data)

    }
  
}
