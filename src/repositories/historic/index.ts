import { prisma } from '@/config'
import { Historic } from '@prisma/client'

async function insert(data: Omit<Historic, 'id' | 'createdAt'>) {
  const historic = await prisma.historic.create({
    data,
  })

  return historic
}
async function getById(historicId: number) {
  const historic = await prisma.historic.findUnique({
    where: {
      id: historicId,
    },
    select: {
      id: true,
      quiz: true,
      createdAt: true,
      answers: {
        select: {
          question: {
            select: {
              id: true,
              question: true,
              response: true,
            },
          },
          response: true,
        },
      },
    },
  })

  return historic
}
async function getAllByUser(playerId: number) {
  const historic = await prisma.historic.findMany({
    where: {
      playerId,
    },
    select: {
      id: true,
      quizId: true,
      createdAt: true,
    },
  })

  return historic
}
export { insert, getAllByUser, getById }
