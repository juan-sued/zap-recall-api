import { INewQuiz, IObjRegisterAnswer } from '@/interfaces/quizzes'
import { quizzesService } from '@/services'
import { errorFactory } from '@/utils'
import { Historic, Quiz } from '@prisma/client'
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

  if (idParams) result = await quizzesService.quiz.getById(idParams)

  if (!title && !idParams) result = await quizzesService.quiz.getAll()

  if (result === null) throw errorFactory.notFound('Result')

  response.status(200).send(result)
}

async function exclude(request: Request, response: Response) {
  const { idParams } = response.locals
  await quizzesService.quiz.exclude(idParams)

  response.sendStatus(200)
}

async function insertAnswer(request: Request, response: Response) {
  const { userId } = response.locals

  const { quizId, answers }: IObjRegisterAnswer = request.body

  await quizzesService.answer.insertAnswer({
    quizId,
    answers,
    playerId: userId,
  })

  response.sendStatus(201)
}

async function incrementAttempt(request: Request, response: Response) {
  const { quiz } = response.locals

  await quizzesService.quiz.incrementAttempt(quiz.id)

  response.sendStatus(200)
}

async function getHistoric(request: Request, response: Response) {
  const { id } = request.params
  const { userId } = response.locals
  let result: any = null

  if (id) {
    result = await quizzesService.quiz.getHistoricById(id)
  } else {
    result = await quizzesService.quiz.getAllHistoricByUser(userId)
  }

  response.send(result).status(200)
}
const answer = {
  insertAnswer,
}
const quiz = {
  exclude,
  get,
  insert,
  incrementAttempt,
  getHistoric,
}

export { quiz, answer }
