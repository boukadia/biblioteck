import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { log } from 'console';
import { LoginDto } from './dto/Login.dto';

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
    const initials = data.nom.charAt(0).toUpperCase() + data.prenom.charAt(0).toUpperCase();
    const hashedPassword = await bcrypt.hash(data.motDePasse, 10);
    const newUser = await this.prisma.utilisateur.create({
      data: {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        initials:initials,
        motDePasse: hashedPassword,
      },
    });
const { motDePasse, ...safeUser } = newUser;
    const payload = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };

    const access_token = await this.jwtService.signAsync(payload);
    return { token: access_token, user: safeUser };
  }
  async login(data: LoginDto ) {
    const user = await this.prisma.utilisateur.findUnique({
      where: {
        email: data.email,
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
    const { motDePasse, ...safeUser } = user;
    return { token: access_token, user: safeUser };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.utilisateur.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const { motDePasse, ...safeUser } = user;
    return safeUser;
  }
}