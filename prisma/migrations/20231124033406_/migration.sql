/*
  Warnings:

  - You are about to drop the column `description` on the `categories` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "categories_description_key";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "description";
