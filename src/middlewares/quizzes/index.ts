import { quizzesRepository } from '@/repositories'
import { errorFactory } from '@/utils'
import { NextFunction, Request, Response } from 'express'

const validateNotFound = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { idParams } = response.locals

  const isRegisteredQuiz = await quizzesRepository.getById(idParams)

  if (!isRegisteredQuiz) throw errorFactory.notFound('Quiz')

  response.locals.category = isRegisteredQuiz

  next()
}

const validateConflict = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const newQuiz = request.body

  if (!newQuiz) throw errorFactory.unprocessableEntity(['Quiz inexistent'])

  // const isRegisteredQuiz = await quizzesRepository.getById(newQuiz.id)

  // if (isRegisteredQuiz) throw errorFactory.conflict('Quiz')

  next()
}

export { validateConflict, validateNotFound }
