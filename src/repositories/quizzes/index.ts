import { prisma } from '@/config'
import { Difficulty, Prisma, Quiz } from '@prisma/client'

function getAll(): Promise<Quiz[]> {
  const params: Prisma.QuizFindManyArgs = {
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      difficulty: true,
      attempts: true,
      endings: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
      endings: true,
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

async function getAllByAuthorId(authorId: number): Promise<Partial<Quiz>[]> {
  const quiz = await prisma.quiz.findMany({
    where: {
      userId: authorId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      attempts: true,
      endings: true,
      difficulty: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return quiz
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

interface IUpdateDifficulty {
  id: number
  difficulty: Difficulty
}
async function updateDifficulty({ id, difficulty }: IUpdateDifficulty) {
  await prisma.quiz.update({
    where: {
      id,
    },
    data: {
      difficulty,
    },
  })
}

//= ================== ANSWERS ========================//

interface IIncrementAttemptRepository {
  isFinishedWin: boolean
  quizId: number
}

async function incrementAttempt({
  isFinishedWin,
  quizId,
}: IIncrementAttemptRepository) {
  await prisma.quiz.update({
    where: {
      id: quizId,
    },
    data: {
      attempts: {
        increment: 1,
      },
      endings: {
        increment: isFinishedWin ? 1 : 0,
      },
    },
  })
}

export {
  exclude,
  getAll,
  getByFilterTitle,
  getById,
  insert,
  incrementAttempt,
  getAllByAuthorId,
  updateDifficulty,
}
