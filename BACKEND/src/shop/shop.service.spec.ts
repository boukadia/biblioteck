/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { ShopService } from './shop.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
const mockPrismaService = {
  recompense: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  utilisateur: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  bonusPossede: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  historiquePoints: {
    create: jest.fn(),
  },
  $transaction: jest.fn(async (cb) => cb(mockPrismaService)),
};

describe('ShopService', () => {
  let service: ShopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShopService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ShopService>(ShopService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('acheterRecompense', () => {
    const user = { userId: 1 };
    const reward = { id: 1, cout: 50, type: 'XP_BOOST' };

    it('should throw NotFoundException if reward does not exist', async () => {
      mockPrismaService.recompense.findUnique.mockResolvedValue(null);
      await expect(service.acheterRecompense(1, user as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if insufficient points', async () => {
      mockPrismaService.recompense.findUnique.mockResolvedValue(reward);
      mockPrismaService.utilisateur.findUnique.mockResolvedValue({
        id: 1,
        pointsActuels: 30,
      });
      await expect(service.acheterRecompense(1, user as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should complete purchase and return new bonus', async () => {
      mockPrismaService.recompense.findUnique.mockResolvedValue(reward);
      mockPrismaService.utilisateur.findUnique.mockResolvedValue({
        id: 1,
        pointsActuels: 100,
      });
      mockPrismaService.bonusPossede.create.mockResolvedValue({ id: 10 });

      const result = await service.acheterRecompense(1, user as any);
      expect(result.message).toContain('Achat réussi');
      expect(result.nouveauxPoints).toBe(50);
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });
  });

  describe('getMesBonus', () => {
    it('should return unconsumed bonuses for user', async () => {
      const bonuses = [{ id: 1 }];
      mockPrismaService.bonusPossede.findMany.mockResolvedValue(bonuses);
      const result = await service.getMesBonus({ userId: 1 } as any);
      expect(result).toEqual(bonuses);
    });
  });
});
