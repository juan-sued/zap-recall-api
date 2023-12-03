import { prisma } from '@/config'
import { Prisma, Quiz } from '@prisma/client'

//= ================== GET =====================//

function getAll(): Promise<Quiz[]> {
  const params: Prisma.QuizFindManyArgs = {
    include: {
      category: true
    }
  }

  const quizzes = prisma.quiz.findMany(params)

  return quizzes
}

async function getById(id: number): Promise<Partial<Quiz>> {
  const quiz = await prisma.quiz.findUnique({
    where: {
      id
    },

    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      },
      quizzyQuestion: {
        select: {
          question: true
        }
      }
    }
  })

  return quiz
}

function getByFilterTitle(name: string): Promise<Quiz[]> {
  const params: Prisma.QuizFindManyArgs = {
    where: {
      title: {
        startsWith: `${name}`,
        mode: 'insensitive'
      }
    },
    skip: 0,
    take: undefined
  }

  return prisma.quiz.findMany(params)
}

//= ================ INSERT ===================//

async function insert(data: Omit<Quiz, 'id'>) {
  await prisma.quiz.create({
    data
  })
}

//= ================ UPDATE ===================//

//= ================ exclude ===================//

async function exclude(id: number) {
  await prisma.quiz.delete({ where: { id } })
}

export { exclude, getAll, getByFilterTitle, getById, insert }
