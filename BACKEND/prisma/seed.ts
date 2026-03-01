// import { PrismaClient } from '../generated/prisma';

import { PrismaClient } from 'generated/prisma/client';

// import { PrismaClient } from 'generated/prisma/client';

// import { PrismaClient } from "@prisma/client/scripts/default-index.js";
// import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');

  // 1. Créer les Récompenses (Boutique)
  const rewards = [
    {
      nom: 'Time Boost',
      description: 'Ajoute 7 jours à votre emprunt',
      cout: 50,
      type: 'TIME_BOOST',
    },
    {
      nom: 'Immunity',
      description: 'Gèle les pénalités pendant 3 jours',
      cout: 100,
      type: 'IMMUNITY',
    },
    {
      nom: 'Pass VIP',
      description: 'Empruntez jusqu’à 5 livres pendant 30 jours',
      cout: 300,
      type: 'PREMIUM_PASS',
    },
    {
      nom: 'Extra Slot',
      description: 'Un livre supplémentaire pour cet emprunt',
      cout: 150,
      type: 'EXTRA_SLOT',
    },
    {
      nom: 'Account Reset',
      description: 'Efface vos dettes et vous débloque',
      cout: 500,
      type: 'ACCOUNT_RESET',
    },
  ];

  for (const r of rewards) {
    await prisma.recompense.upsert({
      where: { id: rewards.indexOf(r) + 1 }, // Pour éviter les doublons
      update: {},
      create: r as any,
    });
  }

  // 2. Créer quelques Livres de test
  const books = [
    {
      titre: 'Clean Code',
      auteur: 'Robert C. Martin',
      isbn: '978-0132350884',
      categorie: 'Informatique',
      stock: 5,
    },
    {
      titre: 'The Pragmatic Programmer',
      auteur: 'Andrew Hunt',
      isbn: '978-0201616224',
      categorie: 'Informatique',
      stock: 3,
    },
    {
      titre: 'L’Alchimiste',
      auteur: 'Paulo Coelho',
      isbn: '978-2290004449',
      categorie: 'Littérature',
      stock: 10,
    },
  ];

  for (const b of books) {
    await prisma.livre.upsert({
      where: { isbn: b.isbn },
      update: {},
      create: b,
    });
  }

  // 3. Créer un Admin de test
  await prisma.utilisateur.upsert({
    where: { email: 'admin@bibliotech.com' },
    update: {},
    create: {
      nom: 'Admin Biblio',
      email: 'admin@bibliotech.com',
      motDePasse: 'admin123', // À hasher plus tard !
      role: 'ADMIN',
    },
  });

  console.log('✅ Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
