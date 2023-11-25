import { Router } from 'express'

import { authController } from '@/controllers'
import { authMiddleware, schemaMiddleware } from '@/middlewares'
import { authSchemas } from '@/schemas'

export const authRouter = Router()

authRouter
  .post(
    '/sign-up',
    schemaMiddleware.validateSchemaMiddleware(authSchemas.signUpSchema),
    authMiddleware.validateConflictByEmail,
    authController.signUp
  )
  .post(
    '/sign-in',
    schemaMiddleware.validateSchemaMiddleware(authSchemas.signInSchema),
    authMiddleware.validateNotFoundByEmail,
    authMiddleware.validatePassword,
    authController.signIn
  )
