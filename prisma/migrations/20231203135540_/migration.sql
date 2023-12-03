-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- AlterTable
ALTER TABLE "quizzies" ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "difficulty" "Difficulty" NOT NULL DEFAULT 'easy',
ADD COLUMN     "percentEndings" INTEGER NOT NULL DEFAULT 0;
