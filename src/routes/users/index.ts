import { usersController } from '@/controllers'
import {
  authMiddleware,
  schemaMiddleware,
  sharedMiddleware,
} from '@/middlewares'

import { userSchemas } from '@/schemas'
import { Router } from 'express'

const usersRouter = Router()

usersRouter
  .get('/', usersController.get)
  .all('*', authMiddleware.validateJwtToken)
  .get('/:id', sharedMiddleware.validateIdParams, usersController.get)
  .patch(
    '/',
    schemaMiddleware.validateSchema(userSchemas.userUpdate),
    usersController.update,
  )
  .delete('/', usersController.exclude)

export { usersRouter }
