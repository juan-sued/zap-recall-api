/*
  Warnings:

  - You are about to drop the `quiz_questions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quizId` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "quiz_questions" DROP CONSTRAINT "quiz_questions_questionId_fkey";

-- DropForeignKey
ALTER TABLE "quiz_questions" DROP CONSTRAINT "quiz_questions_quizId_fkey";

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "quizId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "quiz_questions";

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
