import { Router } from 'express'

import { authController } from '@/controllers'
import { authMiddleware, schemaMiddleware } from '@/middlewares'
import { authSchemas } from '@/schemas'

export const authRouter = Router()

authRouter
  .post(
    '/sign-up',
    schemaMiddleware.validateSchema(authSchemas.signUpSchema),
    authMiddleware.validateConflictByEmail,
    authController.signUp
  )
  .post(
    '/sign-in',
    schemaMiddleware.validateSchema(authSchemas.signInSchema),
    authMiddleware.validateNotFoundByEmail,
    authController.signIn
  )
