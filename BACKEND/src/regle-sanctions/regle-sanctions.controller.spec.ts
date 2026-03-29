import { Test, TestingModule } from '@nestjs/testing';
import { RegleSanctionsController } from './regle-sanctions.controller';
import { RegleSanctionsService } from './regle-sanctions.service';

describe('RegleSanctionsController', () => {
  let controller: RegleSanctionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegleSanctionsController],
      providers: [RegleSanctionsService],
    })
      .useMocker(() => ({}))
      .compile();

    controller = module.get<RegleSanctionsController>(RegleSanctionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
