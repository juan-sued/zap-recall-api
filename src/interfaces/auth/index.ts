import { User } from '@prisma/client'

type ISignInRequest = Pick<User, 'email' | 'password'>

interface ISignUpRequest extends Pick<User, 'name' | 'email' | 'password'> {
  confirmPassword?: string
}

interface ISignInResponse {
  user: {
    id: number
    name: string
  }
  token: string
}

export { ISignInRequest, ISignInResponse, ISignUpRequest }
