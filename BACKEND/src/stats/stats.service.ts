import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma:PrismaService){}
  async getDashboardStats() {
    const now = new Date();

  
    const [
      totalLivres,
      empruntsActifs,
      demandesEnAttente,
      empruntsEnRetard,
      totalEtudiants,
    ] = await Promise.all([
      this.prisma.livre.count(),

      this.prisma.emprunt.count({
        where: { statut: 'EN_COURS' }, 
      }),

      this.prisma.emprunt.count({
        where: { statut: 'EN_ATTENTE' }, 
      }),

      this.prisma.emprunt.count({
        where: {
          statut: 'EN_COURS',
          dateEcheance: {
            lt: now, 
          },
        },
      }),

      this.prisma.utilisateur.count({
        where: { role: 'ETUDIANT' },
      }),
    ]);

    return {
      totalLivres,
      empruntsActifs,
      demandesEnAttente,
      empruntsEnRetard,
      totalEtudiants,
    };
  }
}
