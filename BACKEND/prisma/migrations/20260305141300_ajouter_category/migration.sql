/*
  Warnings:

  - You are about to drop the column `categorie` on the `livre` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `livre` DROP COLUMN `categorie`,
    ADD COLUMN `categoryId` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Livre` ADD CONSTRAINT `Livre_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
