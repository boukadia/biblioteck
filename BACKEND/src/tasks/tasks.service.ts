import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatutEmprunt } from '@prisma/client';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.log('Vérification des retards en cours...');

    const maintenant = new Date();

    const retards = await this.prisma.emprunt.findMany({
      where: {
        statut: StatutEmprunt.EN_COURS,
        dateEcheance: { lt: maintenant },
      },
    });

    if (retards.length > 0) {
      await this.prisma.emprunt.updateMany({
        where: { id: { in: retards.map((r) => r.id) } },
        data: { statut: StatutEmprunt.EN_RETARD },
      });

      this.logger.log(`${retards.length} emprunts marqués comme EN_RETARD.`);
    }
  }
}
