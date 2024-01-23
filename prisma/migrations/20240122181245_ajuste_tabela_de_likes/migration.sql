/*
  Warnings:

  - You are about to drop the column `quizId` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `likes` table. All the data in the column will be lost.
  - Added the required column `historicId` to the `likes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_quizId_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_userId_fkey";

-- AlterTable
ALTER TABLE "likes" DROP COLUMN "quizId",
DROP COLUMN "userId",
ADD COLUMN     "historicId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_historicId_fkey" FOREIGN KEY ("historicId") REFERENCES "historic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
