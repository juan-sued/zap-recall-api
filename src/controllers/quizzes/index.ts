import { INewQuiz, IObjRegisterAnswer } from '@/interfaces/quizzes'
import { authMiddleware } from '@/middlewares'
import { quizzesService } from '@/services'
import { errorFactory } from '@/utils'
import { Quiz } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'

async function insert(request: Request, response: Response) {
  const newQuiz: INewQuiz = request.body
  const userId = response.locals.idUser
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

async function insertAnswer(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.header('Authorization')
  let userId = null
  if (authHeader) {
    await authMiddleware.validateJwtToken(request, response, next)
    userId = response.locals.idUser
  }

  const { quizId, answers }: IObjRegisterAnswer = request.body

  await quizzesService.answer.insertAnswer({
    quizId,
    answers,
    userId,
  })

  response.sendStatus(201)
}
const answer = {
  insertAnswer,
}
const quiz = {
  exclude,
  get,
  insert,
}

export { quiz, answer }
