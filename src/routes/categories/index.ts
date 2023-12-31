import { categoriesController } from '@/controllers'
import {
  authMiddleware,
  categoriesMiddleware,
  schemaMiddleware,
  sharedMiddleware
} from '@/middlewares'
import { categoriesSchemas } from '@/schemas'

import { Router } from 'express'

const categoriesRouter = Router()

categoriesRouter
  .get('/', categoriesController.get)
  .all('/*', authMiddleware.validateJwtToken)
  .get(
    '/:id',
    sharedMiddleware.validateIdParams,
    categoriesMiddleware.validateNotFound,
    categoriesController.get
  )
  .post(
    '/',
    schemaMiddleware.validateSchema(categoriesSchemas.category),
    categoriesMiddleware.validateConflict,
    categoriesController.insert
  )
  .patch(
    '/:id',
    sharedMiddleware.validateIdParams,
    categoriesMiddleware.validateNotFound,
    schemaMiddleware.validateSchema(categoriesSchemas.categoryUpdate),
    categoriesController.update
  )
  .delete(
    '/:id',
    sharedMiddleware.validateIdParams,
    categoriesMiddleware.validateNotFound,
    categoriesController.exclude
  )

export { categoriesRouter }
