/*
  Warnings:

  - You are about to drop the column `historicId` on the `likes` table. All the data in the column will be lost.
  - Added the required column `likeId` to the `historic` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_historicId_fkey";

-- AlterTable
ALTER TABLE "historic" ADD COLUMN     "likeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "likes" DROP COLUMN "historicId";

-- AddForeignKey
ALTER TABLE "historic" ADD CONSTRAINT "historic_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historic" ADD CONSTRAINT "historic_likeId_fkey" FOREIGN KEY ("likeId") REFERENCES "likes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
