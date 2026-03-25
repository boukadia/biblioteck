import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
// @UseGuards(JwtAuthGuard,RolesGuard)

@Controller('stats')
// @Roles("ADMIN")
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('')
  async getStats() {
    return await this.statsService.getDashboardStats();
}
}
