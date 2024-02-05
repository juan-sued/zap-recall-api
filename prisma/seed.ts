import { Category, Difficulty, PrismaClient, Quiz, User } from '@prisma/client';
import { loadEnv } from '../src/config';
import { quizzesInterfaces } from '../src/interfaces';
import bcrypt from 'bcrypt';


const prisma = new PrismaClient()


async function main() {

  await cleanDB()
  loadEnv()
}


main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })







  async function cleanDB(){
    await prisma.historic.deleteMany()
    await prisma.like.deleteMany()

    await prisma.answer.deleteMany()
    await prisma.question.deleteMany()
    await prisma.quiz.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()
    }
