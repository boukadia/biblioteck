import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { CategoriesService } from 'src/categories/categories.service';

@Module({
  controllers: [BooksController],
  providers: [BooksService,CategoriesService],
})
export class BooksModule {}
