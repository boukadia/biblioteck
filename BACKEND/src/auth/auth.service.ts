import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/Login.dto';
import { JwtUser } from './interfaces/jwt-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: CreateAuthDto) {
    const user = await this.prisma.utilisateur.findFirst({
      where: {
        email: data.email,
      },
    });
    if (user) {
      throw new BadRequestException('email already exists');
    }
    const initials =
      data.nom.charAt(0).toUpperCase() + data.prenom.charAt(0).toUpperCase();
    const hashedPassword = await bcrypt.hash(data.motDePasse, 10);
    const newUser = await this.prisma.utilisateur.create({
      data: {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        initials: initials,
        motDePasse: hashedPassword,
      },
    });

    const payload = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    const userSansMotDePasse = {
      ...newUser,
      motDePasse: undefined,
    };

    const access_token = await this.jwtService.signAsync(payload);
    return { token: access_token, user: userSansMotDePasse };
  }
  async login(data: LoginDto) {
    const user = await this.prisma.utilisateur.findUnique({
      where: {
        email: data.email,
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        pointsActuels: true,
        niveau: true,
        motDePasse: true,
      },
    });
    if (!user) {
      throw new BadRequestException('invalid email');
    }
    const isPassword = await bcrypt.compare(data.motDePasse, user.motDePasse);
    if (!isPassword) {
      throw new BadRequestException('invalid password');
    }
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const access_token = await this.jwtService.signAsync(payload);
    const userSansMotDePasse = {
      ...user,
      motDePasse: undefined,
    };

    return { token: access_token, user: userSansMotDePasse };
  }

  async getProfile(user: JwtUser) {
    const connectedUser = await this.prisma.utilisateur.findUnique({
      where: {
        id: user.userId,
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        pointsActuels: true,
        niveau: true,
      },
    });
    if (!connectedUser) {
      throw new BadRequestException('User not found');
    }
    return connectedUser;
  }
}
