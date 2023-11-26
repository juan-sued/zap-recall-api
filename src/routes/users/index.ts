import { usersController } from '@/controllers'
import {
  authMiddleware,
  schemaMiddleware,
  sharedMiddleware
} from '@/middlewares'

import { userSchemas } from '@/schemas'
import { Router } from 'express'

const usersRouter = Router()

usersRouter
  .all('*', authMiddleware.validateJwtToken)
  .get('/', usersController.get)
  .get('/:id', sharedMiddleware.validateIdParams, usersController.get)
  .patch(
    '/',
    schemaMiddleware.validateSchema(userSchemas.userUpdateSchema),
    usersController.update
  )
  .delete('/', usersController.exclude)

export { usersRouter }
