import { errorFactory } from '@/utils'
import { NextFunction, Request, Response } from 'express'

const validateIdParams = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { id } = request.params

  if (!id) throw errorFactory.unprocessableEntity(['id inexistent'])

  const idNumber = Number(id)
  if (isNaN(idNumber))
    throw errorFactory.unprocessableEntity(['id must be a number'])

  response.locals.idParams = idNumber
  next()
}

export { validateIdParams }
