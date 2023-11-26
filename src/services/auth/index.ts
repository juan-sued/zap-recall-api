import { SignUp } from '@/entities'
import { usersRepository } from '@/repositories'
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

async function signIn({
  id,
  name,
  email
}: Pick<User, 'id' | 'name' | 'email'>) {
  const token = createToken(id)

  return {
    user: {
      id,
      name,
      email
    },
    token
  }
}

export { signIn, signUp }
