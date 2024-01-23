import { prisma } from '@/config'
import { INewQuiz, IHistoricBody } from '@/interfaces/quizzes'
import {
  answersRepository,
  historicRepository,
  likesRepository,
  quizzesRepository,
} from '@/repositories'
import { errorFactory } from '@/utils'
import { Category, Quiz } from '@prisma/client'
import { Request, Response } from 'express'
import { decodedToken } from '../auth/jwtToken'

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
    endings: 0,
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

interface IGetById {
  request: Request
  idParams: number
}

async function getById({
  request,
  idParams,
}: IGetById): Promise<Partial<Quiz>> {
  const authHeader = request.header('Authorization')

  const quiz = await quizzesRepository.getById(idParams)
  if (!quiz) throw errorFactory.notFound('quiz')

  let quizWithLike: any = { ...quiz, isLiked: null }
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    if (!token) throw errorFactory.unauthorized('token')

    const payload = await decodedToken(token)

    const userId = payload.id

    const liked = await likesRepository.verifyIfLikeByQuizIdAndPlayerId({
      playerId: userId,
      quizId: quiz.id,
    })

    if (liked) quizWithLike = { ...quiz, isLiked: liked.like.likeStatus }
  }

  return quizWithLike
}

async function exclude(id: number) {
  await quizzesRepository.exclude(id)
}

// answer

interface IInsertHistoricService extends IHistoricBody {
  playerId: number
}

async function insertHistoric({
  quizId,
  playerId,
  answers,
  isLiked,
}: IInsertHistoricService) {
  const isQuizLiked = await likesRepository.verifyIfLikeByQuizIdAndPlayerId({
    playerId,
    quizId,
  })

  if (isQuizLiked && isLiked === null) throw errorFactory.conflict('Like')

  const like = await likesRepository.insert({
    likeStatus: isLiked,
  })

  const historic = await historicRepository.insert({
    playerId,
    quizId,
    likeId: like.id,
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
