import { Module } from '@nestjs/common';
import { EmpruntsService } from './emprunts.service';
import { EmpruntsController } from './emprunts.controller';
import { BadgesModule } from 'src/badges/badges.module';

@Module({
  imports:[BadgesModule],
  controllers: [EmpruntsController],
  providers: [EmpruntsService],
})
export class EmpruntsModule {}
