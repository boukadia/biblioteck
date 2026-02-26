import { Injectable } from '@nestjs/common';
import { CreateSanctionDto } from './dto/create-sanction.dto';
import { UpdateSanctionDto } from './dto/update-sanction.dto';

@Injectable()
export class SanctionsService {
  create(createSanctionDto: CreateSanctionDto) {
    return 'This action adds a new sanction';
  }

  findAll() {
    return `This action returns all sanctions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sanction`;
  }

  update(id: number, updateSanctionDto: UpdateSanctionDto) {
    return `This action updates a #${id} sanction`;
  }

  remove(id: number) {
    return `This action removes a #${id} sanction`;
  }
}
