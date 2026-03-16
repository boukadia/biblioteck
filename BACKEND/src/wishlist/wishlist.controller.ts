import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @Roles('ETUDIANT')
  ajouterLivre(@Body() createWishlistDto: CreateWishlistDto, @Request() req: any) {
    return this.wishlistService.ajouterLivre(createWishlistDto, req.user);
  }

  @Get()
  @Roles('ETUDIANT')
  getMaListe(@Request() req: any) {
    return this.wishlistService.getMaListe(req.user);
  }

  @Delete(':livreId')
  @Roles('ETUDIANT')
  retirerLivre(
    @Param('livreId', ParseIntPipe) livreId: number,
    @Request() req: any,
  ) {
    return this.wishlistService.retirerLivre(livreId, req.user);
  }
}