import { categoriesController } from '@/controllers'
import {
  authMiddleware,
  categoriesMiddleware,
  schemaMiddleware,
  sharedMiddleware
} from '@/middlewares'

import { categorySchema, categoryUpdateSchema } from '@/schemas/categorySchemas'
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
    schemaMiddleware.validateSchema(categorySchema),
    categoriesMiddleware.validateConflict,
    categoriesController.insert
  )
  .patch(
    '/:id',
    sharedMiddleware.validateIdParams,
    categoriesMiddleware.validateNotFound,
    schemaMiddleware.validateSchema(categoryUpdateSchema),
    categoriesController.update
  )
  .delete(
    '/:id',
    sharedMiddleware.validateIdParams,
    categoriesMiddleware.validateNotFound,
    categoriesController.exclude
  )

export { categoriesRouter }
