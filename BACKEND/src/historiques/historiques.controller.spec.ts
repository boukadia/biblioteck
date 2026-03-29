import { Test, TestingModule } from '@nestjs/testing';
import { HistoriquesController } from './historiques.controller';
import { HistoriquesService } from './historiques.service';

describe('HistoriquesController', () => {
  let controller: HistoriquesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoriquesController],
      providers: [HistoriquesService],
    })
      .useMocker(() => ({}))
      .compile();

    controller = module.get<HistoriquesController>(HistoriquesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
