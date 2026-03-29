import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}
  async getDashboardStats() {
    const now = new Date();

    const [
      totalLivres,
      empruntsAnnules,
      empruntsActifs,
      demandesEnAttente,
      empruntsEnRetard,
      totalEtudiants,
      etudiantsEnRetard,
    ] = await Promise.all([
      this.prisma.livre.count(),
      this.prisma.emprunt.count({ where: { statut: 'ANNULE' } }),
      this.prisma.emprunt.count({ where: { statut: 'EN_COURS' } }),
      this.prisma.emprunt.count({ where: { statut: 'EN_ATTENTE' } }),
      this.prisma.emprunt.count({
        where: {
          statut: 'EN_RETARD',
          dateEcheance: { lt: now },
        },
      }),
      this.prisma.utilisateur.count({ where: { role: 'ETUDIANT' } }),
      this.prisma.emprunt
        .findMany({
          where: {
            statut: 'EN_RETARD',
            dateEcheance: { lt: now },
          },
          select: { utilisateurId: true },
          distinct: ['utilisateurId'],
        })
        .then((rows) => rows.length),
    ]);

    return {
      totalLivres,
      empruntsAnnules,
      empruntsActifs,
      demandesEnAttente,
      empruntsEnRetard,
      totalEtudiants,
      etudiantsEnRetard,
    };
  }
}
