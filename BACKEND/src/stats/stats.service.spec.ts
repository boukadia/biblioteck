import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from './stats.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  livre: { count: jest.fn() },
  emprunt: { count: jest.fn(), findMany: jest.fn() },
  utilisateur: { count: jest.fn() },
};

describe('StatsService', () => {
  let service: StatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDashboardStats', () => {
    it('should aggregate statistics from various tables', async () => {
      mockPrismaService.livre.count.mockResolvedValue(100);
      mockPrismaService.emprunt.count.mockResolvedValue(10);
      mockPrismaService.utilisateur.count.mockResolvedValue(50);
      mockPrismaService.emprunt.findMany.mockResolvedValue([]); // for etudiantsEnRetard

      const result = await service.getDashboardStats();

      expect(result.totalLivres).toBe(100);
      expect(result.totalEtudiants).toBe(50);
      expect(mockPrismaService.livre.count).toHaveBeenCalled();
      expect(mockPrismaService.emprunt.count).toHaveBeenCalled();
    });
  });
});
