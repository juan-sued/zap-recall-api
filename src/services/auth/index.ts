import { SignIn, SignUp } from '@/entities'
import { usersRepository } from '@/repositories'
import { errorFactory } from '@/utils'
import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { createToken } from './jwtToken'

async function signUp({ email, name, password }: SignUp): Promise<User> {
  password = await bcrypt.hash(password, 10)

  return await usersRepository.insert({
    email,
    name,
    password
  })
}

async function signIn({ email, password }: SignIn) {
  const userInDB = await usersRepository.getByEmail(email)

  const dbPassword = userInDB.password ?? ''

  const isValidPassword = await bcrypt.compare(password, dbPassword)

  if (!isValidPassword) throw errorFactory.forbidden()

  const token = createToken(userInDB.id)

  return {
    user: {
      id: userInDB.id,
      name: userInDB.name,
      email
    },
    token
  }
}

export { signIn, signUp }
