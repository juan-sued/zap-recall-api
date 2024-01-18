import { quizzesController } from '@/controllers'
import {
  authMiddleware,
  quizzesMiddleware,
  schemaMiddleware,
  sharedMiddleware,
} from '@/middlewares'
import { quizzesSchemas } from '@/schemas'

import { Router } from 'express'

const quizzesRouter = Router()

quizzesRouter
  .get('/', quizzesController.quiz.get)
  .get(
    '/:id',
    sharedMiddleware.validateIdParams,
    quizzesMiddleware.validateNotFound,
    quizzesController.quiz.get,
  )
  .post(
    '/attempts/:id',
    sharedMiddleware.validateIdParams,
    quizzesMiddleware.validateNotFound,
    quizzesController.quiz.incrementAttempt,
  )

  .all('/*', authMiddleware.validateJwtToken)

  .post(
    '/',
    schemaMiddleware.validateSchema(quizzesSchemas.quiz),
    quizzesMiddleware.validateConflict,
    quizzesController.quiz.insert,
  )
  .patch(
    '/:id',
    sharedMiddleware.validateIdParams,
    quizzesMiddleware.validateNotFound,
    schemaMiddleware.validateSchema(quizzesSchemas.quiz),
  )
  .delete(
    '/:id',
    sharedMiddleware.validateIdParams,
    quizzesMiddleware.validateNotFound,
    quizzesController.quiz.exclude,
  )
  .post(
    '/answers',
    schemaMiddleware.validateSchema(quizzesSchemas.objRegisterAnswer),
    quizzesMiddleware.validateNotFound,
    quizzesController.answer.insertAnswer,
  )

export { quizzesRouter }
