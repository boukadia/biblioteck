/*
  Warnings:

  - Added the required column `image` to the `Livre` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `emprunt` MODIFY `statut` ENUM('EN_ATTENTE', 'EN_COURS', 'ANNULE', 'RETOURNE') NOT NULL DEFAULT 'EN_ATTENTE';

-- AlterTable
ALTER TABLE `livre` ADD COLUMN `image` VARCHAR(191) NOT NULL;
