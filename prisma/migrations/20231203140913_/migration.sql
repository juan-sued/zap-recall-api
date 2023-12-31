/*
  Warnings:

  - Made the column `attempts` on table `quizzies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `percentEndings` on table `quizzies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "quizzies" ALTER COLUMN "attempts" SET NOT NULL,
ALTER COLUMN "percentEndings" SET NOT NULL;
