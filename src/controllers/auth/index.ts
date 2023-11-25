import { SignUp } from '@/entities'
import { authInterfaces } from '@/interfaces'
import { authService } from '@/services'
import { Request, Response } from 'express'

async function signUp(request: Request, response: Response) {
  const newUser = new SignUp(request.body)
  await authService.signUp(newUser)

  response.sendStatus(201)
}

async function signIn(request: Request, response: Response) {
  const { userInDB } = response.locals

  const loginResponse: authInterfaces.ISignInResponse =
    await authService.signIn(userInDB)
  response.status(200).send(loginResponse)
}

export { signIn, signUp }
