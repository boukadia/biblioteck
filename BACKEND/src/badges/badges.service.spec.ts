/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { BadgesService } from './badges.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { RoleUtilisateur } from '@prisma/client';

const mockPrismaService = {
  badge: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  badgeEtudiant: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  utilisateur: {
    findUnique: jest.fn(),
  },
};

describe('BadgesService', () => {
  let service: BadgesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BadgesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BadgesService>(BadgesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const adminUser = { role: RoleUtilisateur.ADMIN };
    const createDto = { nom: 'Expert', conditionXP: 1000, description: 'Test' };

    it('should throw ForbiddenException if not admin', async () => {
      await expect(
        service.create(createDto, { role: RoleUtilisateur.ETUDIANT } as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if badge name already exists', async () => {
      mockPrismaService.badge.findFirst.mockResolvedValue({ id: 1 });
      await expect(service.create(createDto, adminUser as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create badge successfully', async () => {
      mockPrismaService.badge.findFirst.mockResolvedValue(null);
      mockPrismaService.badge.create.mockResolvedValue({ id: 1, ...createDto });
      const result = await service.create(createDto, adminUser as any);
      expect(result.nom).toBe('Expert');
    });
  });

  describe('verifierEtAttribuerBadges', () => {
    it('should return empty if user not found', async () => {
      mockPrismaService.utilisateur.findUnique.mockResolvedValue(null);
      const result = await service.verifierEtAttribuerBadges(1);
      expect(result.nouveauxBadges).toHaveLength(0);
    });

    it('should attribute new badges if XP threshold met', async () => {
      mockPrismaService.utilisateur.findUnique.mockResolvedValue({ xp: 500 });
      mockPrismaService.badge.findMany.mockResolvedValue([
        { id: 1, conditionXP: 100, nom: 'Bronze' },
        { id: 2, conditionXP: 500, nom: 'Silver' },
      ]);
      mockPrismaService.badgeEtudiant.findMany.mockResolvedValue([
        { badgeId: 1 }, // Already has Bronze
      ]);
      mockPrismaService.badgeEtudiant.create.mockResolvedValue({
        badgeId: 2,
        badge: { nom: 'Silver' },
      });

      const result = await service.verifierEtAttribuerBadges(1);
      expect(result.nouveauxBadges).toHaveLength(1);
      expect(result.nouveauxBadges[0].badge.nom).toBe('Silver');
    });
  });
});
