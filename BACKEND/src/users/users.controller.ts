import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
  @UseGuards(JwtAuthGuard,RolesGuard)

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  
  @Get('')
  @Roles('ADMIN')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  changeStatus(@Param('id') id: number) {
    return this.usersService.changeStatus(+id);
  }
  @Put(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles("ADMIN")
  remove(@Param('id') id: string,@Request() req : any) {
    return this.usersService.remove(+id,req.user);
  }

  @Patch(':id/changePassword')
  changePaassword(@Param('id') id:number, @Body() password:ChangePasswordDto, @Request() req: any ){
    return this.usersService.changePaassword(password ,+id, req.user)
  }
}
