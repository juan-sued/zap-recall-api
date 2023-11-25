import { ISignUp } from '@/interfaces/auth'
import { usersRepository } from '@/repositories'
import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { createToken } from './jwtToken'

async function signInService(userInDB: User) {
  const token = createToken(userInDB.id)

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

  return await usersRepository.insert({
    email,
    name,
    password,
    confirmPassword
  })
}

export { signInService, signUpService }
