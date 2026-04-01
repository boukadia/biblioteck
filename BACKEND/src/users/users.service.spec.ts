/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { RoleUtilisateur, StatutUtilisateur } from '@prisma/client';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockPrismaService = {
  utilisateur: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  historiquePoints: { deleteMany: jest.fn() },
  bonusPossede: { deleteMany: jest.fn() },
  badgeEtudiant: { deleteMany: jest.fn() },
  sanction: { deleteMany: jest.fn() },
  listeSouhaits: { deleteMany: jest.fn() },
  emprunt: { deleteMany: jest.fn() },
  $transaction: jest.fn(async (cb) => cb(mockPrismaService)),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, nom: 'Test' }];
      mockPrismaService.utilisateur.findMany.mockResolvedValue(users);
      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(mockPrismaService.utilisateur.findMany).toHaveBeenCalled();
    });
  });

  describe('changeStatus', () => {
    const adminUser = {
      userId: 1,
      email: 'admin@test.com',
      role: RoleUtilisateur.ADMIN,
    };
    const normalUser = {
      userId: 2,
      email: 'user@test.com',
      role: RoleUtilisateur.ETUDIANT,
    };

    it('should throw ForbiddenException if not admin', async () => {
      await expect(service.changeStatus(1, normalUser as any)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should toggle status from ACTIF to BLOQUE', async () => {
      mockPrismaService.utilisateur.findUnique.mockResolvedValue({
        id: 1,
        statut: StatutUtilisateur.ACTIF,
      });
      mockPrismaService.utilisateur.update.mockResolvedValue({
        id: 1,
        statut: 'BLOQUE',
      });

      const result = await service.changeStatus(1, adminUser as any);
      expect(result.statut).toBe('BLOQUE');
      expect(mockPrismaService.utilisateur.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { statut: 'BLOQUE' },
      });
    });
  });

  describe('findOne', () => {
    it('should throw ForbiddenException if not admin and not self', async () => {
      const user = { userId: 1, role: RoleUtilisateur.ETUDIANT };
      await expect(service.findOne(2, user as any)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should return user if admin or self', async () => {
      const user = { id: 1, nom: 'Test' };
      mockPrismaService.utilisateur.findFirst.mockResolvedValue(user);
      const result = await service.findOne(1, {
        userId: 1,
        role: RoleUtilisateur.ETUDIANT,
      } as any);
      expect(result).toEqual(user);
    });
  });

  describe('remove', () => {
    const adminUser = { userId: 1, role: RoleUtilisateur.ADMIN };

    it('should throw BadRequestException if user has active loans', async () => {
      mockPrismaService.utilisateur.findFirst.mockResolvedValue({
        id: 2,
        emprunts: [{ id: 1 }],
      });
      await expect(service.remove(2, adminUser as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should delete user and related data if no active loans', async () => {
      mockPrismaService.utilisateur.findFirst.mockResolvedValue({
        id: 2,
        emprunts: [],
      });
      mockPrismaService.utilisateur.delete.mockResolvedValue({ id: 2 });

      const result = await service.remove(2, adminUser as any);
      expect(result.message).toBe('User successfully deleted');
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });
  });

  describe('changePaassword', () => {
    it('should update password with bcrypt hash', async () => {
      mockPrismaService.utilisateur.findFirst.mockResolvedValue({ id: 1 });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      mockPrismaService.utilisateur.update.mockResolvedValue({
        id: 1,
        nom: 'Test',
      });

      const result = await service.changePaassword(
        { motDePasse: 'new_pass' },
        1,
        { userId: 1 } as any,
      );
      expect(result.nom).toBe('Test');
      expect(bcrypt.hash).toHaveBeenCalledWith('new_pass', 10);
    });
  });

  describe('getTopStudents', () => {
    it('should return top 5 students', async () => {
      const users = [{ id: 1, xp: 100 }];
      mockPrismaService.utilisateur.findMany.mockResolvedValue(users);
      const result = await service.getTopStudents();
      expect(result).toEqual(users);
      expect(mockPrismaService.utilisateur.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
          orderBy: { xp: 'desc' },
        }),
      );
    });
  });
});
