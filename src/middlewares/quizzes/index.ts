import { IObjRegisterAnswer } from '@/interfaces/quizzes'
import { quizzesRepository } from '@/repositories'
import { errorFactory } from '@/utils'
import { NextFunction, Request, Response } from 'express'

const validateNotFound = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { idParams } = response.locals
  const { quizId, answers }: IObjRegisterAnswer = request.body

  const id = idParams ?? quizId

  const isRegisteredQuiz = await quizzesRepository.quiz.getById(id)

  if (!isRegisteredQuiz) throw errorFactory.notFound('Quiz')

  if (answers && answers.length !== isRegisteredQuiz.questions.length) {
    throw errorFactory.unprocessableEntity([
      'The number of answers is different from the number of questions',
    ])
  }
  response.locals.quiz = isRegisteredQuiz

  next()
}

const validateConflict = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const newQuiz = request.body

  if (!newQuiz) throw errorFactory.unprocessableEntity(['Quiz inexistent'])

  // const isRegisteredQuiz = await quizzesRepository.quiz.getById(newQuiz.id)

  // if (isRegisteredQuiz) throw errorFactory.conflict('Quiz')

  next()
}

export { validateConflict, validateNotFound }
