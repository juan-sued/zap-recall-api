import { quizzesController } from '@/controllers'
import {
  authMiddleware,
  quizzesMiddleware,
  schemaMiddleware,
  sharedMiddleware
} from '@/middlewares'
import { quizzesSchemas } from '@/schemas'

import { Router } from 'express'

const quizzesRouter = Router()

quizzesRouter
  .get('/', quizzesController.get)
  .get(
    '/:id',
    sharedMiddleware.validateIdParams,
    quizzesMiddleware.validateNotFound,
    quizzesController.get
  )
  .post(
    '/',
    schemaMiddleware.validateSchema(quizzesSchemas.quiz),
    quizzesMiddleware.validateConflict,

    quizzesController.insert
  )
  .all('/*', authMiddleware.validateJwtToken)
  .patch(
    '/:id',
    sharedMiddleware.validateIdParams,
    quizzesMiddleware.validateNotFound,
    schemaMiddleware.validateSchema(quizzesSchemas.quiz)
  )
  .delete(
    '/:id',
    sharedMiddleware.validateIdParams,
    quizzesMiddleware.validateNotFound,
    quizzesController.exclude
  )

export { quizzesRouter }
