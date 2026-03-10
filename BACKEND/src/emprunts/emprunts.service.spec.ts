import { Test, TestingModule } from '@nestjs/testing';
import { EmpruntsService } from './emprunts.service';

describe('EmpruntsService', () => {
  let service: EmpruntsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmpruntsService],
    }).compile();

    service = module.get<EmpruntsService>(EmpruntsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
