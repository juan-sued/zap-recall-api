import dotenv from 'dotenv'

import { NextFunction, Request, Response } from 'express'

import { SignIn } from '@/entities'
import { usersRepository } from '@/repositories'
import { decodedToken } from '@/services/auth/jwtToken'
import { errorFactory } from '@/utils/index'
import bcrypt from 'bcrypt'

dotenv.config()

async function validateJwtToken(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.header('Authorization')
  if (!authHeader) throw errorFactory.unauthorized('authHeader')

  const token = authHeader.split(' ')[1]
  if (!token) throw errorFactory.unauthorized('token')
  const payload = await decodedToken(token)

  const user = await usersRepository.getById(payload.id)

  if (!user) throw errorFactory.notFound('usuário inexistente')

  response.locals.idUser = payload.id

  next()
}

const validateNotFoundByEmail = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { email } = request.body

  const isRegisteredUser = await usersRepository.getByEmail(email)

  if (!isRegisteredUser) throw errorFactory.forbidden()

  response.locals.userInDB = isRegisteredUser
  next()
}

const validateConflictByEmail = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { email } = request.body
  const isRegisteredUser = await usersRepository.getByEmail(email)

  if (isRegisteredUser) throw errorFactory.conflict('User')

  response.locals.user = request.body

  next()
}

const validatePassword = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id, name, email, password } = request.body

  const userLogin: SignIn = new SignIn({ id, name, email, password })

  const { userInDB } = response.locals

  const dbPassword = userInDB.password ?? ''

  const isValidPassword = await bcrypt.compare(userLogin.password, dbPassword)

  if (!isValidPassword) throw errorFactory.forbidden()

  next()
}

export {
  validateConflictByEmail,
  validateJwtToken,
  validateNotFoundByEmail,
  validatePassword
}
