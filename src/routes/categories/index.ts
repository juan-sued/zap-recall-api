import {
  deleteCategories,
  getCategories,
  insertCategories,
  updateCategories
} from '@/controllers/categories/categoriesController'
import {
  validateIdParamsMiddleware,
  validateJwtTokenMiddleware,
  validateSchemaMiddleware
} from '@/middlewares'
import {
  validateConflictCategoriesMiddleware,
  validateNotFoundCategoriesMiddleware
} from '@/middlewares/categories'
import { categorySchema, categoryUpdateSchema } from '@/schemas/categorySchemas'
import { Router } from 'express'

const categoriesRouter = Router()

categoriesRouter
  .get('/', getCategories)
  .all('/*', validateJwtTokenMiddleware)
  .post(
    '/',
    validateSchemaMiddleware(categorySchema),
    validateConflictCategoriesMiddleware,
    insertCategories
  )
  .get(
    '/:id',
    validateIdParamsMiddleware,
    validateNotFoundCategoriesMiddleware,
    getCategories
  )
  .patch(
    '/:id',
    validateIdParamsMiddleware,
    validateNotFoundCategoriesMiddleware,
    validateSchemaMiddleware(categoryUpdateSchema),
    updateCategories
  )
  .delete(
    '/:id',
    validateIdParamsMiddleware,
    validateNotFoundCategoriesMiddleware,
    deleteCategories
  )

export { categoriesRouter }
