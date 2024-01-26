-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_historicId_fkey";

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_historicId_fkey" FOREIGN KEY ("historicId") REFERENCES "historic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
