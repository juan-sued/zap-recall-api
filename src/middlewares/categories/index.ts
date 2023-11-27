import { categoriesRepository } from '@/repositories'
import { errorFactory } from '@/utils'
import { NextFunction, Request, Response } from 'express'

const validateConflict = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { title } = request.body
  if (!title) throw errorFactory.unprocessableEntity(['Title inexistent'])

  const isRegisteredCategories =
    await categoriesRepository.getByFilterTitle(title)

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
