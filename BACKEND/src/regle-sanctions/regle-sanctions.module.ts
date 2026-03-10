import { Module } from '@nestjs/common';
import { RegleSanctionsService } from './regle-sanctions.service';
import { RegleSanctionsController } from './regle-sanctions.controller';

@Module({
  controllers: [RegleSanctionsController],
  providers: [RegleSanctionsService],
})
export class RegleSanctionsModule {}
