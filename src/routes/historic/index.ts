import { quizzesController } from '@/controllers'
import { authMiddleware } from '@/middlewares'

import { Router } from 'express'

const historicRouter = Router()

historicRouter
  .all('/*', authMiddleware.validateJwtToken)
  .get('/', quizzesController.quiz.getHistoric)
  .get('/:id', quizzesController.quiz.getHistoric)
export { historicRouter }
