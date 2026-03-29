import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtUser } from 'src/auth/interfaces/jwt-user.interface';
import { Request as ExpressRequest } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('leaderboard')
  async getLeaderboard() {
    return await this.usersService.getTopStudents();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ETUDIANT')
  findOne(
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    return this.usersService.findOne(+id, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  changeStatus(
    @Param('id') id: number,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    return this.usersService.changeStatus(+id, req.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    return this.usersService.update(+id, updateUserDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: JwtUser },
  ): Promise<{ message: string; user: JwtUser }> {
    return this.usersService.remove(+id, req.user);
  }

  @Patch(':id/changePassword')
  @UseGuards(JwtAuthGuard, RolesGuard)
  changePaassword(
    @Param('id') id: number,
    @Body() password: ChangePasswordDto,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    return this.usersService.changePaassword(password, +id, req.user);
  }
}
