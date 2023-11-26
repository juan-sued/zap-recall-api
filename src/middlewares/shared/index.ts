import { errorFactory } from '@/utils'
import { NextFunction, Request, Response } from 'express'

const validateIdParams = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id } = request.params
  if (!id) throw errorFactory.unprocessableEntity(['id inexistent'])

  response.locals.idParams = Number(id)
  next()
}

export { validateIdParams }
