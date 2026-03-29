import { Test, TestingModule } from '@nestjs/testing';
import { EmpruntsController } from './emprunts.controller';
import { EmpruntsService } from './emprunts.service';

describe('EmpruntsController', () => {
  let controller: EmpruntsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmpruntsController],
      providers: [EmpruntsService],
    })
      .useMocker(() => ({}))
      .compile();

    controller = module.get<EmpruntsController>(EmpruntsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
