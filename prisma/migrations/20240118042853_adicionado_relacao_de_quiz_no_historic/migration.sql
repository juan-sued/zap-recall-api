-- AddForeignKey
ALTER TABLE "historic" ADD CONSTRAINT "historic_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
