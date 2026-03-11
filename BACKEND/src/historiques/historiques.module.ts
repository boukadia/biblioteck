import { Module } from '@nestjs/common';
import { HistoriquesService } from './historiques.service';
import { HistoriquesController } from './historiques.controller';

@Module({
  controllers: [HistoriquesController],
  providers: [HistoriquesService],
})
export class HistoriquesModule {}
