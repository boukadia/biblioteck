/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { EmpruntsService } from './emprunts.service';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { StatutEmprunt } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

// On simule le PrismaService complet
const mockPrismaService = {
  emprunt: {
    findUnique: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
  },
  bonusPossede: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
  livre: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  utilisateur: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  $transaction: jest.fn(async (cb) => {
    // Dans nos tests, on mock la transaction en lui passant direct mockPrismaService
    return cb(mockPrismaService);
  }),
};

describe('EmpruntsService', () => {
  let service: EmpruntsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmpruntsService,
        {
          provide: PrismaService, // on importe la classe PrismaService directement
          useValue: mockPrismaService,
        },
      ],
    })
      .useMocker(() => ({}))
      .compile();

    // S'il n'arrive pas à résoudre par token chaîne, il essaiera par classe, on garde abstrait
    service = module.get<EmpruntsService>(EmpruntsService);
    jest.clearAllMocks();
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  describe('declarerRetour', () => {
    const mockUser = {
      userId: 1,
      email: 'etudiant@youcode.ma',
      role: 'ETUDIANT',
    } as any;

    it("devrait jeter une NotFoundException si l'emprunt n'existe pas", async () => {
      mockPrismaService.emprunt.findUnique.mockResolvedValue(null);
      await expect(service.declarerRetour(mockUser, 99)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("devrait jeter une ForbiddenException si l'emprunt n'appartient pas à l'utilisateur", async () => {
      mockPrismaService.emprunt.findUnique.mockResolvedValue({
        id: 99,
        utilisateurId: 2,
      });
      await expect(service.declarerRetour(mockUser, 99)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("devrait jeter une BadRequestException si l'emprunt n'est pas EN_COURS ou EN_RETARD", async () => {
      mockPrismaService.emprunt.findUnique.mockResolvedValue({
        id: 99,
        utilisateurId: 1,
        statut: StatutEmprunt.RETOURNE,
      });
      await expect(service.declarerRetour(mockUser, 99)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('devrait réussir à déclarer un retour', async () => {
      mockPrismaService.emprunt.findUnique.mockResolvedValue({
        id: 99,
        utilisateurId: 1,
        statut: StatutEmprunt.EN_COURS,
        dateEcheance: new Date(Date.now() + 100000),
      });

      mockPrismaService.emprunt.update.mockResolvedValue({
        id: 99,
        statut: StatutEmprunt.EN_ATTENTE_RETOUR,
      });

      const result = await service.declarerRetour(mockUser, 99);
      expect(result.message).toContain('Retour déclaré avec succès');
      expect(mockPrismaService.emprunt.update).toHaveBeenCalled();
    });
  });
});
