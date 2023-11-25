import { ISign, ISignUp } from '@/interfaces/auth'
import { usersRepository } from '@/repositories'
import { errorFactory } from '@/utils'
import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { createToken } from './jwtToken'

async function signInService(userLogin: ISign, userInDB: User) {
  const dbPassword = userInDB?.password ?? ''

  const isValidPassword = await bcrypt.compare(userLogin.password, dbPassword)

  if (!isValidPassword) throw errorFactory.forbidden()

  const userId = Number(userInDB?.id) ?? 0
  const token = createToken(userId)

  return {
    user: {
      id: userInDB.id,
      name: userInDB.name,
      email: userInDB.email
    },
    token
  }
}

async function signUpService({
  email,
  name,
  password,
  confirmPassword
}: ISignUp): Promise<User> {
  password = await bcrypt.hash(password, 10)
  return await usersRepository.insertUser({
    email,
    name,
    password,
    confirmPassword
  })
}

export { signInService, signUpService }
