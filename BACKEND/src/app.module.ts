import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { ShopModule } from './shop/shop.module';
import { BadgesModule } from './badges/badges.module';
import { SanctionsModule } from './sanctions/sanctions.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { NotesModule } from './notes/notes.module';
import { ActivitesModule } from './activites/activites.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmpruntsModule } from './emprunts/emprunts.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [AuthModule, UsersModule, BooksModule, ShopModule, BadgesModule, SanctionsModule, WishlistModule, NotesModule, ActivitesModule, PrismaModule, EmpruntsModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
