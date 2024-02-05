import { INewQuiz, IHistoricBody } from '@/interfaces/quizzes'
import { quizzesService } from '@/services'
import { TIncrementAttempt } from '@/services/quizzes'
import { errorFactory } from '@/utils'
import { Quiz } from '@prisma/client'
import { Request, Response } from 'express'

async function insert(request: Request, response: Response) {
  const newQuiz: INewQuiz = request.body
  const { userId } = response.locals
  await quizzesService.quiz.insert(newQuiz, userId)

  response.sendStatus(201)
}

async function get(request: Request, response: Response) {
  const { title } = request.query as Record<string, string>
  const { idParams } = response.locals
  let result: Partial<Quiz>[] | Partial<Quiz> | null = []

  if (title) result = await quizzesService.quiz.getByTitle(title)

  if (idParams)
    result = await quizzesService.quiz.getById({ request, idParams })

  if (!title && !idParams) result = await quizzesService.quiz.getAll()

  if (result === null) throw errorFactory.notFound('Result')

  response.status(200).send(result)
}

async function exclude(request: Request, response: Response) {
  const { idParams } = response.locals
  await quizzesService.quiz.exclude(idParams)

  response.sendStatus(200)
}

async function insertHistoric(request: Request, response: Response) {
  const { userId } = response.locals

  const { quizId, answers, isLiked }: IHistoricBody = request.body

  await quizzesService.historic.insertHistoric({
    quizId,
    answers,
    playerId: userId,
    isLiked,
  })

  response.sendStatus(201)
}

async function incrementAttempt(request: Request, response: Response) {
  const { quizId, answers }: TIncrementAttempt = request.body

  await quizzesService.quiz.incrementAttempt({ answers, quizId })

  response.sendStatus(200)
}

async function getHistoricByAuthor(request: Request, response: Response) {
  const { userId } = response.locals

  const result = await quizzesService.historic.getHistoricByAuthor(userId)

  response.send(result).status(200)
}

async function getHistoricByPlay(request: Request, response: Response) {
  const { userId } = response.locals

  const result = await quizzesService.historic.getHistoricByPlayer(userId)

  response.send(result).status(200)
}

async function getHistoricById(request: Request, response: Response) {
  const { idParams } = response.locals
  const result = await quizzesService.historic.getHistoricById(idParams)

  response.send(result).status(200)
}

async function getHistoricMetaData(request: Request, response: Response) {
  const { userId } = response.locals
  const metaData = await quizzesService.historic.getHistoricMetaData(userId)

  response.send(metaData).status(200)
}

const quiz = {
  exclude,
  get,
  insert,
  incrementAttempt,
}

const historic = {
  insertHistoric,
  getHistoricByAuthor,
  getHistoricByPlay,
  getHistoricById,
  getHistoricMetaData,
}

export { quiz, historic }
