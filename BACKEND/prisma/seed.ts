import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'bibliotech',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Debut du seeding...');

  // ==========================================
  // 1. Categories
  // ==========================================
  console.log('Creation des categories...');
  const catInformatique = await prisma.category.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Informatique', description: 'Livres techniques et programmation' },
  });
  const catLitterature = await prisma.category.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'Litterature', description: 'Romans et litterature generale' },
  });
  const catScience = await prisma.category.upsert({
    where: { id: 3 },
    update: {},
    create: { name: 'Science', description: 'Livres scientifiques et recherche' },
  });
  const catHistoire = await prisma.category.upsert({
    where: { id: 4 },
    update: {},
    create: { name: 'Histoire', description: "Livres d'histoire et biographies" },
  });
  const catPhilosophie = await prisma.category.upsert({
    where: { id: 5 },
    update: {},
    create: { name: 'Philosophie', description: 'Philosophie et pensee critique' },
  });

  // ==========================================
  // 2. Utilisateurs (Admin + Etudiants)
  // ==========================================
  console.log('Creation des utilisateurs...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.utilisateur.upsert({
    where: { email: 'admin@bibliotech.com' },
    update: {},
    create: {
      nom: 'Admin Biblio',
      email: 'admin@bibliotech.com',
      motDePasse: hashedPassword,
      role: 'ADMIN',
    },
  });

  const etudiant1 = await prisma.utilisateur.upsert({
    where: { email: 'ahmed@etudiant.com' },
    update: {},
    create: {
      nom: 'Ahmed Benali',
      email: 'ahmed@etudiant.com',
      motDePasse: hashedPassword,
      role: 'ETUDIANT',
      niveau: 2,
      xp: 120,
      pointsActuels: 80,
    },
  });

  const etudiant2 = await prisma.utilisateur.upsert({
    where: { email: 'sara@etudiant.com' },
    update: {},
    create: {
      nom: 'Sara Idrissi',
      email: 'sara@etudiant.com',
      motDePasse: hashedPassword,
      role: 'ETUDIANT',
      niveau: 3,
      xp: 250,
      pointsActuels: 150,
    },
  });

  const etudiant3 = await prisma.utilisateur.upsert({
    where: { email: 'youssef@etudiant.com' },
    update: {},
    create: {
      nom: 'Youssef El Amrani',
      email: 'youssef@etudiant.com',
      motDePasse: hashedPassword,
      role: 'ETUDIANT',
      niveau: 1,
      xp: 30,
      pointsActuels: 20,
    },
  });

  // ==========================================
  // 3. Livres
  // ==========================================
  console.log('Creation des livres...');
  const livres = [
    { titre: 'Clean Code', auteur: 'Robert C. Martin', isbn: '978-0132350884', stock: 5, categoryId: catInformatique.id },
    { titre: 'The Pragmatic Programmer', auteur: 'Andrew Hunt', isbn: '978-0201616224', stock: 3, categoryId: catInformatique.id },
    { titre: 'Design Patterns', auteur: 'Gang of Four', isbn: '978-0201633610', stock: 4, categoryId: catInformatique.id },
    { titre: 'Introduction to Algorithms', auteur: 'Thomas H. Cormen', isbn: '978-0262033848', stock: 2, categoryId: catInformatique.id },
    { titre: 'Le Petit Prince', auteur: 'Antoine de Saint-Exupery', isbn: '978-2070612758', stock: 10, categoryId: catLitterature.id },
    { titre: "L'Etranger", auteur: 'Albert Camus', isbn: '978-2070360024', stock: 6, categoryId: catLitterature.id },
    { titre: 'Les Miserables', auteur: 'Victor Hugo', isbn: '978-2253004226', stock: 4, categoryId: catLitterature.id },
    { titre: 'Sapiens', auteur: 'Yuval Noah Harari', isbn: '978-0062316097', stock: 3, categoryId: catHistoire.id },
    { titre: 'Homo Deus', auteur: 'Yuval Noah Harari', isbn: '978-0062464316', stock: 2, categoryId: catHistoire.id },
    { titre: 'Cosmos', auteur: 'Carl Sagan', isbn: '978-0345539434', stock: 3, categoryId: catScience.id },
    { titre: 'Une breve histoire du temps', auteur: 'Stephen Hawking', isbn: '978-2290307083', stock: 5, categoryId: catScience.id },
    { titre: 'Le Monde de Sophie', auteur: 'Jostein Gaarder', isbn: '978-2020550765', stock: 4, categoryId: catPhilosophie.id },
  ];

  for (const livre of livres) {
    await prisma.livre.upsert({
      where: { isbn: livre.isbn },
      update: {},
      create: livre,
    });
  }

  // ==========================================
  // 4. Recompenses (Boutique)
  // ==========================================
  console.log('Creation des recompenses...');
  const recompenses = [
    { nom: 'Time Boost', description: 'Prolongation de 7 jours sur votre emprunt', cout: 50, type: 'PROLONGATION' as const, dureeValiditeJours: 30 },
    { nom: 'Bouclier', description: 'Protection contre une penalite de retard', cout: 100, type: 'PROTECTION' as const, dureeValiditeJours: 15 },
    { nom: 'Pass Premium', description: "Empruntez jusqu'a 5 livres pendant 30 jours", cout: 300, type: 'PREMIUM' as const, dureeValiditeJours: 30 },
    { nom: 'Extra Slot', description: 'Un livre supplementaire pour cet emprunt', cout: 150, type: 'BONUS' as const },
    { nom: 'Reactivation', description: 'Reactive un compte bloque par une sanction', cout: 500, type: 'REACTIVATION' as const },
  ];

  for (let i = 0; i < recompenses.length; i++) {
    await prisma.recompense.upsert({
      where: { id: i + 1 },
      update: {},
      create: recompenses[i],
    });
  }

  // ==========================================
  // 5. Badges
  // ==========================================
  console.log('Creation des badges...');
  const badges = [
    { nom: 'Lecteur Debutant', description: 'Premier emprunt effectue', conditionXP: 10 },
    { nom: 'Lecteur Assidu', description: '10 emprunts retournes a temps', conditionXP: 100 },
    { nom: 'Rat de Bibliotheque', description: '50 emprunts retournes a temps', conditionXP: 500 },
    { nom: 'Bibliophile', description: 'Atteindre le niveau 5', conditionXP: 250 },
    { nom: 'Ponctuel', description: '5 retours consecutifs a temps', conditionXP: 50 },
    { nom: 'Explorateur', description: 'Emprunter dans 3 categories differentes', conditionXP: 75 },
  ];

  for (let i = 0; i < badges.length; i++) {
    await prisma.badge.upsert({
      where: { id: i + 1 },
      update: {},
      create: badges[i],
    });
  }

  // ==========================================
  // 6. Emprunts
  // ==========================================
  console.log('Creation des emprunts...');

  // Ahmed - emprunt en cours
  await prisma.emprunt.create({
    data: {
      utilisateurId: etudiant1.id,
      livreId: 1,
      dateEmprunt: new Date('2026-02-20'),
      dateEcheance: new Date('2026-03-06'),
      statut: 'EN_COURS',
    },
  });

  // Sara - emprunt retourne
  await prisma.emprunt.create({
    data: {
      utilisateurId: etudiant2.id,
      livreId: 5,
      dateEmprunt: new Date('2026-02-01'),
      dateEcheance: new Date('2026-02-15'),
      dateRetour: new Date('2026-02-14'),
      statut: 'RETOURNE',
    },
  });

  // Sara - emprunt en attente de retour
  await prisma.emprunt.create({
    data: {
      utilisateurId: etudiant2.id,
      livreId: 8,
      dateEmprunt: new Date('2026-02-25'),
      dateEcheance: new Date('2026-03-11'),
      statut: 'EN_ATTENTE_RETOUR',
    },
  });

  // Youssef - emprunt en retard
  await prisma.emprunt.create({
    data: {
      utilisateurId: etudiant3.id,
      livreId: 10,
      dateEmprunt: new Date('2026-02-01'),
      dateEcheance: new Date('2026-02-15'),
      statut: 'EN_RETARD',
    },
  });

  // ==========================================
  // 7. Historique des points
  // ==========================================
  console.log('Creation de l\'historique des points...');
  await prisma.historiquePoints.createMany({
    data: [
      { utilisateurId: etudiant1.id, montant: 10, type: 'GAIN_EMPRUNT', description: 'Emprunt de Clean Code' },
      { utilisateurId: etudiant2.id, montant: 10, type: 'GAIN_EMPRUNT', description: 'Emprunt de Le Petit Prince' },
      { utilisateurId: etudiant2.id, montant: 10, type: 'GAIN_EMPRUNT', description: 'Retour a temps - Le Petit Prince' },
      { utilisateurId: etudiant3.id, montant: 10, type: 'GAIN_EMPRUNT', description: 'Emprunt de Cosmos' },
      { utilisateurId: etudiant3.id, montant: -15, type: 'PERTE_RETARD', description: 'Retard de retour - Cosmos' },
    ],
  });

  // ==========================================
  // 8. Badges attribues
  // ==========================================
  console.log('Attribution des badges...');
  await prisma.badgeEtudiant.createMany({
    data: [
      { utilisateurId: etudiant1.id, badgeId: 1 },
      { utilisateurId: etudiant2.id, badgeId: 1 },
      { utilisateurId: etudiant2.id, badgeId: 5 },
    ],
  });

  console.log('Seeding termine avec succes !');
  console.log('  - 5 categories');
  console.log('  - 1 admin + 3 etudiants');
  console.log('  - 12 livres');
  console.log('  - 5 recompenses');
  console.log('  - 6 badges');
  console.log('  - 4 emprunts');
  console.log('  - 5 mouvements de points');
  console.log('  - 3 badges attribues');
}

main()
  .catch((e) => {
    console.error('Erreur durant le seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
