/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { RoleUtilisateur } from '@prisma/client';

const mockPrismaService = {
  livre: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  category: {
    findUnique: jest.fn(),
  },
};

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const adminUser = { role: RoleUtilisateur.ADMIN };
    const createDto = {
      titre: 'Test Book',
      auteur: 'Author',
      isbn: '12345',
      categoryId: 1,
      image: 'test.jpg',
    };

    it('should throw ForbiddenException if not admin', async () => {
      await expect(
        service.create(createDto, { role: RoleUtilisateur.ETUDIANT } as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if book with ISBN already exists', async () => {
      mockPrismaService.livre.findUnique.mockResolvedValue({ id: 1 });
      await expect(service.create(createDto, adminUser as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create book if category exists', async () => {
      mockPrismaService.livre.findUnique.mockResolvedValue(null);
      mockPrismaService.category.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.livre.create.mockResolvedValue({
        id: 1,
        titre: 'Test Book',
      });

      const result = await service.create(createDto, adminUser as any);
      expect(result.titre).toBe('Test Book');
    });
  });

  describe('stock', () => {
    it('should increment stock', async () => {
      mockPrismaService.livre.findUnique.mockResolvedValue({ id: 1, stock: 5 });
      mockPrismaService.livre.update.mockResolvedValue({ id: 1, stock: 10 });

      const result = await service.stock(1, { quantity: 5 });
      expect(result.stock).toBe(10);
      expect(mockPrismaService.livre.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { stock: { increment: 5 } },
        }),
      );
    });
  });

  describe('recherche', () => {
    it('should throw BadRequestException if search term is empty', async () => {
      await expect(service.recherche('')).rejects.toThrow(BadRequestException);
    });

    it('should return search results', async () => {
      const books = [{ id: 1, titre: 'Target' }];
      mockPrismaService.livre.findMany.mockResolvedValue(books);

      const result = await service.recherche('Target');
      expect(result.books).toHaveLength(1);
      expect(result.totalResults).toBe(1);
    });
  });
});
