import { Module } from '@nestjs/common';
import { EmpruntsService } from './emprunts.service';
import { EmpruntsController } from './emprunts.controller';

@Module({
  controllers: [EmpruntsController],
  providers: [EmpruntsService],
})
export class EmpruntsModule {}
