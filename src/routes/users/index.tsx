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
  .all('*', authMiddleware.validateJwtTokenMiddleware)
  .get('/', usersController.get)
  .get('/:id', sharedMiddleware.validateIdParamsMiddleware, usersController.get)
  .patch(
    '/',
    schemaMiddleware.validateSchemaMiddleware(userSchemas.userUpdateSchema),
    usersController.update
  )
  .delete('/', usersController.exclude)

export { usersRouter }
