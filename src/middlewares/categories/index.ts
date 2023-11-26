import { categoriesRepository } from '@/repositories'
import { errorFactory } from '@/utils'
import { NextFunction, Request, Response } from 'express'

const validateConflict = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { name } = request.body
  if (!name) throw errorFactory.unprocessableEntity(['name inexistent'])

  const isRegisteredCategories =
    await categoriesRepository.getByFilterName(name)
  console.log(isRegisteredCategories)

  if (isRegisteredCategories.length > 0)
    throw errorFactory.conflict('Categories')

  response.locals.product = isRegisteredCategories

  next()
}
const validateNotFound = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { idParams } = response.locals

  const isRegisteredCategories = await categoriesRepository.getById(idParams)

  if (!isRegisteredCategories) throw errorFactory.notFound('Category')

  response.locals.category = isRegisteredCategories

  next()
}

export { validateConflict, validateNotFound }
