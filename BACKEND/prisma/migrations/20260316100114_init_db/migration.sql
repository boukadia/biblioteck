-- CreateTable
CREATE TABLE `Utilisateur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `motDePasse` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'ETUDIANT') NOT NULL DEFAULT 'ETUDIANT',
    `statut` ENUM('ACTIF', 'BLOQUE') NOT NULL DEFAULT 'ACTIF',
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `niveau` INTEGER NULL DEFAULT 1,
    `xp` INTEGER NULL DEFAULT 0,
    `pointsActuels` INTEGER NULL DEFAULT 0,

    UNIQUE INDEX `Utilisateur_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RegleSanction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomRegle` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `penalitePoints` INTEGER NOT NULL,
    `dureeBlocage` INTEGER NOT NULL,

    UNIQUE INDEX `RegleSanction_nomRegle_key`(`nomRegle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Livre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `auteur` VARCHAR(191) NOT NULL,
    `isbn` VARCHAR(191) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 3,
    `categoryId` INTEGER NOT NULL,

    UNIQUE INDEX `Livre_isbn_key`(`isbn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ListeSouhaits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `utilisateurId` INTEGER NOT NULL,
    `livreId` INTEGER NOT NULL,
    `dateAjout` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ListeSouhaits_utilisateurId_livreId_key`(`utilisateurId`, `livreId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Emprunt` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dateEmprunt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateEcheance` DATETIME(3) NOT NULL,
    `dateRetour` DATETIME(3) NULL,
    `statut` ENUM('EN_ATTENTE', 'EN_COURS', 'ANNULE', 'EN_ATTENTE_RETOUR', 'RETOURNE') NOT NULL DEFAULT 'EN_ATTENTE',
    `utilisateurId` INTEGER NOT NULL,
    `livreId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HistoriquePoints` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `montant` INTEGER NOT NULL,
    `dateMouvement` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` ENUM('GAIN_EMPRUNT', 'PERTE_RETARD', 'ACHAT_BOUTIQUE', 'SANCTION_ADMIN') NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `utilisateurId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recompense` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `cout` INTEGER NOT NULL,
    `type` ENUM('PROLONGATION', 'PROTECTION', 'PREMIUM', 'BONUS', 'REACTIVATION') NOT NULL,
    `dureeValiditeJours` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BonusPossede` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dateAchat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estConsomme` BOOLEAN NOT NULL DEFAULT false,
    `dateUtilisation` DATETIME(3) NULL,
    `dateExpiration` DATETIME(3) NULL,
    `utilisateurId` INTEGER NOT NULL,
    `recompenseId` INTEGER NOT NULL,
    `empruntId` INTEGER NULL,

    UNIQUE INDEX `BonusPossede_empruntId_key`(`empruntId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Badge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `conditionXP` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BadgeEtudiant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dateObtention` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `utilisateurId` INTEGER NOT NULL,
    `badgeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sanction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `raison` VARCHAR(191) NOT NULL,
    `penalitePoints` INTEGER NOT NULL,
    `dureeBlocage` INTEGER NOT NULL,
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `utilisateurId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Livre` ADD CONSTRAINT `Livre_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ListeSouhaits` ADD CONSTRAINT `ListeSouhaits_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ListeSouhaits` ADD CONSTRAINT `ListeSouhaits_livreId_fkey` FOREIGN KEY (`livreId`) REFERENCES `Livre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Emprunt` ADD CONSTRAINT `Emprunt_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Emprunt` ADD CONSTRAINT `Emprunt_livreId_fkey` FOREIGN KEY (`livreId`) REFERENCES `Livre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistoriquePoints` ADD CONSTRAINT `HistoriquePoints_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BonusPossede` ADD CONSTRAINT `BonusPossede_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BonusPossede` ADD CONSTRAINT `BonusPossede_recompenseId_fkey` FOREIGN KEY (`recompenseId`) REFERENCES `Recompense`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BonusPossede` ADD CONSTRAINT `BonusPossede_empruntId_fkey` FOREIGN KEY (`empruntId`) REFERENCES `Emprunt`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BadgeEtudiant` ADD CONSTRAINT `BadgeEtudiant_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BadgeEtudiant` ADD CONSTRAINT `BadgeEtudiant_badgeId_fkey` FOREIGN KEY (`badgeId`) REFERENCES `Badge`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sanction` ADD CONSTRAINT `Sanction_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
