import { usersRepository } from '@/repositories'
import { errorFactory } from '@/utils'
import { NextFunction, Request, Response } from 'express'

const validateNotFound = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { idParams } = response.locals

  const isRegisteredUsers =
    await usersRepository.getUserOrAdministratorById(idParams)

  if (!isRegisteredUsers) throw errorFactory.notFound('User')

  response.locals.user = isRegisteredUsers
  next()
}

export { validateNotFound }
