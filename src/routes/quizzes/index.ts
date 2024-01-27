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
  .get('/historic/player', quizzesController.historic.getHistoricByAuthor)
  .get('/historic/author', quizzesController.historic.getHistoricByAuthor)
  .get('/historic/meta-data', quizzesController.historic.getHistoricMetaData)

  .get(
    '/historic/id/:id',
    sharedMiddleware.validateIdParams,
    quizzesController.historic.getHistoricByAuthor,
  )

export { quizzesRouter }
