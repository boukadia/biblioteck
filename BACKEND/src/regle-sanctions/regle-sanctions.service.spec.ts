import { Test, TestingModule } from '@nestjs/testing';
import { RegleSanctionsService } from './regle-sanctions.service';

describe('RegleSanctionsService', () => {
  let service: RegleSanctionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegleSanctionsService],
    }).compile();

    service = module.get<RegleSanctionsService>(RegleSanctionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
