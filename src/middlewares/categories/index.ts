import { categoriesRepository } from '@/repositories'
import { errorFactory } from '@/utils'
import { NextFunction, Request, Response } from 'express'

const validateConflictCategoriesMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { name } = request.body
  if (!name) throw errorFactory.unprocessableEntity(['name inexistent'])

  const isRegisteredCategories =
    await categoriesRepository.getCategoriesByFilterName(name)
  console.log(isRegisteredCategories)

  if (isRegisteredCategories.length > 0)
    throw errorFactory.conflict('Categories')

  response.locals.product = isRegisteredCategories

  next()
}
const validateNotFoundCategoriesMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { idParams } = response.locals

  const isRegisteredCategories =
    await categoriesRepository.getCategoriesById(idParams)

  if (!isRegisteredCategories) throw errorFactory.notFound('Categories')

  response.locals.category = isRegisteredCategories

  next()
}

export {
  validateConflictCategoriesMiddleware,
  validateNotFoundCategoriesMiddleware
}
