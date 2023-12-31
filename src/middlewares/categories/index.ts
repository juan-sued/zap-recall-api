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

  const isRegisteredCategory = await categoriesRepository.getByTitle(title)

  if (isRegisteredCategory) throw errorFactory.conflict('Categories')

  response.locals.category = isRegisteredCategory

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
