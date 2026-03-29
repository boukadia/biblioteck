import { Test, TestingModule } from '@nestjs/testing';
import { SanctionsService } from './sanctions.service';

describe('SanctionsService', () => {
  let service: SanctionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SanctionsService],
    })
      .useMocker(() => ({}))
      .compile();

    service = module.get<SanctionsService>(SanctionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
