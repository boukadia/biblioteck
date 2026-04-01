/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { SanctionsService } from './sanctions.service';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import { RoleUtilisateur } from '@prisma/client';

const mockPrismaService = {
  sanction: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  utilisateur: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  regleSanction: {
    findUnique: jest.fn(),
  },
  historiquePoints: {
    create: jest.fn(),
  },
  $transaction: jest.fn(async (cb) => cb(mockPrismaService)),
};

describe('SanctionsService', () => {
  let service: SanctionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SanctionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SanctionsService>(SanctionsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should throw UnauthorizedException if not admin', async () => {
      await expect(
        service.findAll({ role: RoleUtilisateur.ETUDIANT } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return sanctions if admin', async () => {
      mockPrismaService.sanction.findMany.mockResolvedValue([]);
      const result = await service.findAll({
        role: RoleUtilisateur.ADMIN,
      } as any);
      expect(result).toEqual([]);
    });
  });

  describe('appliquerSanction', () => {
    const adminUser = { role: RoleUtilisateur.ADMIN };
    const data = { utilisateurId: 1, regleId: 1 };

    it('should throw UnauthorizedException if not admin', async () => {
      await expect(
        service.appliquerSanction(data, {
          role: RoleUtilisateur.ETUDIANT,
        } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should apply sanction and update points within transaction', async () => {
      mockPrismaService.utilisateur.findUnique.mockResolvedValue({
        id: 1,
        role: RoleUtilisateur.ETUDIANT,
        pointsActuels: 100,
      });
      mockPrismaService.regleSanction.findUnique.mockResolvedValue({
        id: 1,
        penalitePoints: 20,
        dureeBlocage: 5,
        nomRegle: 'Test Regle',
      });
      mockPrismaService.sanction.create.mockResolvedValue({ id: 10 });

      const result = await service.appliquerSanction(data, adminUser as any);

      expect(result.message).toContain('Sanction appliquée avec succès');
      expect(result.nouveauxPointsUtilisateur).toBe(80);
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });
  });
});
