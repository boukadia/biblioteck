import { Test, TestingModule } from '@nestjs/testing';
import { SanctionsController } from './sanctions.controller';
import { SanctionsService } from './sanctions.service';

describe('SanctionsController', () => {
  let controller: SanctionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SanctionsController],
      providers: [SanctionsService],
    })
      .useMocker(() => ({}))
      .compile();

    controller = module.get<SanctionsController>(SanctionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
