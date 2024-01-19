import { prisma } from '@/config'
import { IAnswer, INewQuiz } from '@/interfaces/quizzes'
import {
  answersRepository,
  historicRepository,
  quizzesRepository,
} from '@/repositories'
import { errorFactory } from '@/utils'
import { Category, Quiz } from '@prisma/client'

async function insert(
  {
    title,
    description,
    newCategory,
    categoryId,
    questions,
    difficulty,
  }: INewQuiz,
  userId: number,
) {
  if (newCategory) {
    const data = {
      title: newCategory,
    }

    const category: Category = await prisma.category.create({
      data,
    })

    categoryId = category.id
  }

  const quiz: Omit<Quiz, 'id'> = {
    title,
    description,
    difficulty,
    attempts: 0,
    percentEndings: 0,
    categoryId,
    userId,
  }

  const quizCreated = await prisma.quiz.create({
    data: quiz,
  })

  for (const question of questions) {
    const newQuestion = {
      quizId: quizCreated.id,
      question: question.question,
      response: question.response,
    }

    await prisma.question.create({
      data: newQuestion,
    })
  }
}

async function getAll(): Promise<Quiz[]> {
  const quizzes = await quizzesRepository.getAll()

  if (!quizzes) throw errorFactory.notFound('quizzes')

  return quizzes
}

async function getByTitle(title: string): Promise<Quiz[]> {
  const quizzes: Quiz[] = await quizzesRepository.getByFilterTitle(title)

  if (!quizzes) throw errorFactory.notFound('quizzes')

  return quizzes
}

async function getById(id: number): Promise<Partial<Quiz>> {
  const quiz = await quizzesRepository.getById(id)

  if (!quiz) throw errorFactory.notFound('quiz')

  return quiz
}

async function exclude(id: number) {
  await quizzesRepository.exclude(id)
}

// answer

interface IRegisterHistoricService {
  quizId: number | null
  playerId: number | null
  answers: IAnswer[]
}

async function insertHistoric({
  quizId,
  playerId,
  answers,
}: IRegisterHistoricService) {
  const historic = await historicRepository.insert({
    playerId,
    quizId,
  })

  for (const answerUnit of answers) {
    const { questionId, answer } = answerUnit
    await answersRepository.insert({
      questionId,
      response: answer,
      historicId: historic.id,
    })
  }

  // criar um answer para cada resposta
}
async function incrementAttempt(quizId: number) {
  await quizzesRepository.incrementAttempt(quizId)
}

async function getHistoricById(id: string) {
  if (!id) throw errorFactory.unprocessableEntity(['id inexistent'])
  const historic = await historicRepository.getById(Number(id))

  if (!historic) throw errorFactory.notFound('Historic')

  return historic
}

async function getAllHistoricByUser(playerId: number) {
  const historic = await historicRepository.getAllByUser(playerId)

  if (!historic) throw errorFactory.notFound('Historic')

  return historic
}

const historic = { insertHistoric }

const quiz = {
  exclude,
  getAll,
  getById,
  getByTitle,
  insert,
  incrementAttempt,
  getHistoricById,
  getAllHistoricByUser,
}

export { quiz, historic }
