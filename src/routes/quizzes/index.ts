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
    '/quiz/:id',
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
    '/quiz/:id',
    sharedMiddleware.validateIdParams,
    quizzesMiddleware.validateNotFound,
    schemaMiddleware.validateSchema(quizzesSchemas.quiz),
  )
  .delete(
    '/quiz/:id',
    sharedMiddleware.validateIdParams,
    quizzesMiddleware.validateNotFound,
    quizzesController.quiz.exclude,
  )

  .post(
    '/historic',
    schemaMiddleware.validateSchema(quizzesSchemas.historic),
    quizzesMiddleware.validateNotFound,
    quizzesController.historic.insertHistoric,
  )
  .get('/historic', quizzesController.historic.getHistoric)
  .get(
    '/historic/id/:id',
    sharedMiddleware.validateIdParams,
    quizzesController.historic.getHistoric,
  )
  .get('/historic/likes', quizzesController.historic.getHistoricLikes)

export { quizzesRouter }
