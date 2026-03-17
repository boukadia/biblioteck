import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'bibliotech',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Nettoyage de la base de données (F7al ila kanti bghiti t-bda mn zero)
  await prisma.emprunt.deleteMany();
  await prisma.badgeEtudiant.deleteMany();
  await prisma.bonusPossede.deleteMany();
  await prisma.livre.deleteMany();
  await prisma.utilisateur.deleteMany();
  await prisma.category.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.recompense.deleteMany();

  console.log('--- Database cleaned ---');

  // 2. Création des Badges (Gamification)
  const badge1 = await prisma.badge.create({
    data: {
      nom: 'Lecteur Débutant',
      description: 'Bienvenue dans l’aventure ! Attribué après votre premier emprunt.',
      // image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      conditionXP: 0,
    },
  });

  const badge2 = await prisma.badge.create({
    data: {
      nom: 'Rat de Bibliothèque',
      description: 'Avoir emprunté plus de 5 livres.',
      // image: 'https://cdn-icons-png.flaticon.com/512/1903/1903162.png',
      conditionXP: 500,
    },
  });

  // 3. Création des Récompenses (Shop)
  await prisma.recompense.createMany({
    data: [
      {
        nom: 'Prolongation de 3 jours',
        description: 'Ajoutez 3 jours supplémentaires à votre emprunt actuel.',
        cout: 150,
        type: 'PROLONGATION',
      },
      {
        nom: 'Immunité Retard',
        description: 'Annule les pénalités pour un retour en retard (usage unique).',
        cout: 300,
        type: 'PROTECTION',
      },
    ],
  });

  // 4. Création des Utilisateurs (Admin et Étudiant)
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.utilisateur.create({
    data: {
      email: 'admin@bibliotech.ma',
      motDePasse: hashedPassword,
      nom: 'Anas Admin',
      role: 'ADMIN',
    },
  });

  const etudiant = await prisma.utilisateur.create({
    data: {
      email: 'anas@etudiant.ma',
      motDePasse: hashedPassword,
      nom: 'Anas Etudiant',
      role: 'ETUDIANT',
      pointsActuels: 1000,
      xp: 500,
      niveau: 2,
    },
  });

  // 5. Création des Catégories
  const techCategory = await prisma.category.create({
    data: { name: 'Technologie', description: 'Livres de technologie et programmation' },
  });

  const romanCategory = await prisma.category.create({
    data: { name: 'Roman', description: 'Littérature générale' },
  });

  const historyCategory = await prisma.category.create({
    data: { name: 'Histoire', description: 'Livres historiques' },
  });

  const scifiCategory = await prisma.category.create({
    data: { name: 'Science-Fiction', description: 'Romans de science-fiction' },
  });

  // 6. Création des Livres
  await prisma.livre.createMany({
    data: [
      {
        titre: 'Clean Code',
        auteur: 'Robert C. Martin',
        categoryId: techCategory.id,
        isbn: '978-0132350884',
        stock: 5,
        image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400',
      },
      {
        titre: 'Le Petit Prince',
        auteur: 'Antoine de Saint-Exupéry',
        categoryId: romanCategory.id,
        isbn: '978-2070612758',
        stock: 10,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
      },
      {
        titre: 'Sapiens',
        auteur: 'Yuval Noah Harari',
        categoryId: historyCategory.id,
        isbn: '978-2226257017',
        stock: 3,
        image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400',
      },
      {
        titre: '1984',
        auteur: 'George Orwell',
        categoryId: scifiCategory.id,
        isbn: '978-0451524935',
        stock: 0, // Indisponible
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
      },
    ],
  });

  console.log('--- Seed completed successfully! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });