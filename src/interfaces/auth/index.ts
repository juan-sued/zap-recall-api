import { User } from '@prisma/client'

type ISignInRequest = Pick<User, 'email' | 'password'>

interface ISignUpRequest extends Pick<User, 'name' | 'email' | 'password'> {
  confirmPassword?: string
}

interface ISignInResponse {
  user: {
    name: string
    email: string
    createdAt: Date
  }
  token: string
}

interface IRecoverUserInformation {
  name: string
  email: string
  createdAt: Date
}
export {
  ISignInRequest,
  ISignInResponse,
  ISignUpRequest,
  IRecoverUserInformation,
}
