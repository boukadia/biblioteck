import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockPrismaService = {
  utilisateur: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const mockJwtService = {
  signAsync: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      nom: 'Nom',
      prenom: 'Prenom',
      motDePasse: 'password123',
    };

    it('should throw BadRequestException if email already exists', async () => {
      mockPrismaService.utilisateur.findFirst.mockResolvedValue({ id: 1 });
      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create a new user and return token', async () => {
      mockPrismaService.utilisateur.findFirst.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrismaService.utilisateur.create.mockResolvedValue({
        id: 1,
        email: registerDto.email,
        nom: registerDto.nom,
        prenom: registerDto.prenom,
        role: 'ETUDIANT',
      });
      mockJwtService.signAsync.mockResolvedValue('access_token');

      const result = await service.register(registerDto);

      expect(result).toEqual({
        token: 'access_token',
        user: {
          id: 1,
          email: registerDto.email,
          nom: registerDto.nom,
          prenom: registerDto.prenom,
          role: 'ETUDIANT',
          motDePasse: undefined,
        },
      });
      expect(mockPrismaService.utilisateur.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      motDePasse: 'password123',
    };

    it('should throw BadRequestException if user not found', async () => {
      mockPrismaService.utilisateur.findUnique.mockResolvedValue(null);
      await expect(service.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if password invalid', async () => {
      mockPrismaService.utilisateur.findUnique.mockResolvedValue({
        email: 'test@example.com',
        motDePasse: 'hashedPassword',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return token and user on successful login', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        motDePasse: 'hashedPassword',
        role: 'ETUDIANT',
      };
      mockPrismaService.utilisateur.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('access_token');

      const result = await service.login(loginDto);

      expect(result).toEqual({
        token: 'access_token',
        user: { ...user, motDePasse: undefined },
      });
    });
  });

  describe('getProfile', () => {
    it('should return user profile if found', async () => {
      const user = { id: 1, email: 'test@example.com', role: 'ETUDIANT' };
      mockPrismaService.utilisateur.findUnique.mockResolvedValue(user);

      const result = await service.getProfile({
        userId: 1,
        email: 'test@example.com',
        role: 'ETUDIANT',
      });
      expect(result).toEqual(user);
    });

    it('should throw BadRequestException if user not found', async () => {
      mockPrismaService.utilisateur.findUnique.mockResolvedValue(null);
      await expect(
        service.getProfile({
          userId: 99,
          email: 'test@example.com',
          role: 'ETUDIANT',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
