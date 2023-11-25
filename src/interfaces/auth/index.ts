import { User } from '@prisma/client'

interface ISign extends Pick<User, 'email' | 'password'> {
  confirmPassword?: string
}

interface ISignUp extends Pick<User, 'name' | 'email' | 'password'> {
  confirmPassword?: string
}

interface ISignInResponse {
  user: {
    id: number
    name: string
  }
  token: string
}

export { ISign, ISignInResponse, ISignUp }
