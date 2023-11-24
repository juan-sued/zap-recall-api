/*
  Warnings:

  - You are about to drop the column `title` on the `questions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "questions_title_key";

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "title";
