import { categoriesRepository } from '@/repositories'
import { errorFactory } from '@/utils'
import { NextFunction, Request, Response } from 'express'

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

export { validateNotFound }
