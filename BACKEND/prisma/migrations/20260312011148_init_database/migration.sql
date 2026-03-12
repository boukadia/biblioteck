/*
  Warnings:

  - The values [EN_RETARD,EN_ATTENTE_RETOUR] on the enum `Emprunt_statut` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `emprunt` MODIFY `statut` ENUM('EN_ATTENTE', 'EN_COURS', 'ANNULE', 'RETOURNE') NOT NULL DEFAULT 'EN_COURS';

-- AlterTable
ALTER TABLE `livre` ALTER COLUMN `categoryId` DROP DEFAULT;

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
