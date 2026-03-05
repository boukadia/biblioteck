import { Injectable } from '@nestjs/common';
import { CreateRecompenseDto } from './dto/create-shop.dto';
import { UpdateRecompenseDto } from './dto/update-shop.dto';

@Injectable()
export class ShopService {
  create(createShopDto: CreateRecompenseDto) {
    return 'This action adds a new shop';
  }

  findAll() {
    return `This action returns all shop`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shop`;
  }

  update(id: number, updateShopDto: UpdateRecompenseDto) {
    return `This action updates a #${id} shop`;
  }

  remove(id: number) {
    return `This action removes a #${id} shop`;
  }
}
