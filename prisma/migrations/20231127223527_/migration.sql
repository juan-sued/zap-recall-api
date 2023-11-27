-- DropForeignKey
ALTER TABLE "quiz_questions" DROP CONSTRAINT "quiz_questions_questionId_fkey";

-- DropForeignKey
ALTER TABLE "quizzies" DROP CONSTRAINT "quizzies_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "quizzies" ADD CONSTRAINT "quizzies_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
