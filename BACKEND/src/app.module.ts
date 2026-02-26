import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { BorrowsModule } from './borrows/borrows.module';
import { ShopModule } from './shop/shop.module';
import { BadgesModule } from './badges/badges.module';
import { SanctionsModule } from './sanctions/sanctions.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { NotesModule } from './notes/notes.module';
import { ActivitesModule } from './activites/activites.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UsersModule, BooksModule, BorrowsModule, ShopModule, BadgesModule, SanctionsModule, WishlistModule, NotesModule, ActivitesModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
