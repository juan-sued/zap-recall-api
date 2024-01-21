/*
  Warnings:

  - You are about to drop the column `percentEndings` on the `quizzies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "quizzies" DROP COLUMN "percentEndings",
ADD COLUMN     "endings" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "likes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,
    "likeStatus" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
