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

const validateConflict = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { newCategory, categoryId } = request.body

  if (!newCategory && !categoryId)
    throw errorFactory.unprocessableEntity([
      'newCategory or categoryId inexistent'
    ])

  if (!categoryId && newCategory) {
    const isRegisteredCategory =
      await categoriesRepository.getByTitle(newCategory)

    if (isRegisteredCategory) throw errorFactory.conflict('Category')
  }

  next()
}

export { validateConflict, validateNotFound }
