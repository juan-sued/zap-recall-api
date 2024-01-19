import { prisma } from '@/config'
import { Answer, Prisma, Quiz } from '@prisma/client'

function getAll(): Promise<Quiz[]> {
  const params: Prisma.QuizFindManyArgs = {
    include: {
      category: true,
    },
  }

  const quizzes = prisma.quiz.findMany(params)

  return quizzes
}

type QuizWithQuestions = Partial<Quiz> & {
  questions: Array<{
    id: number
    question: string
    response: string
  }>
}

async function getById(id: number): Promise<QuizWithQuestions> {
  const quiz = await prisma.quiz.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      attempts: true,
      difficulty: true,
      percentEndings: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      },
      questions: {
        select: {
          id: true,
          question: true,
          response: true,
        },
      },
    },
  })

  return quiz as QuizWithQuestions
}

function getByFilterTitle(name: string): Promise<Quiz[]> {
  const params: Prisma.QuizFindManyArgs = {
    where: {
      title: {
        startsWith: `${name}`,
        mode: 'insensitive',
      },
    },
    skip: 0,
    take: undefined,
  }

  return prisma.quiz.findMany(params)
}

async function insert(data: Omit<Quiz, 'id'>) {
  await prisma.quiz.create({
    data,
  })
}

async function exclude(id: number) {
  await prisma.quiz.delete({ where: { id } })
}

//= ================== ANSWERS ========================//

async function incrementAttempt(quizId: number) {
  await prisma.quiz.update({
    where: {
      id: quizId,
    },
    data: {
      attempts: {
        increment: 1,
      },
    },
  })
}

export { exclude, getAll, getByFilterTitle, getById, insert, incrementAttempt }
