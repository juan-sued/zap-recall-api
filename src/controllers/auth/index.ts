import { SignIn, SignUp } from '@/entities'
import { authInterfaces } from '@/interfaces'
import { authService } from '@/services'
import { Request, Response } from 'express'

async function signUp(request: Request, response: Response) {
  const newUser: SignUp = new SignUp(request.body)
  await authService.signUp(newUser)

  response.sendStatus(201)
}

async function signIn(request: Request, response: Response) {
  const { email, password } = request.body
  const user = new SignIn({ email, password })

  const loginResponse: authInterfaces.ISignInResponse =
    await authService.signIn(user)
  response.status(200).send(loginResponse)
}
async function recoverUserInformation(request: Request, response: Response) {
  const { userId } = response.locals
  const recoverResponse: authInterfaces.IRecoverUserInformation =
    await authService.recoverUserInformation(userId)
  response.status(200).send(recoverResponse)
}

export { signIn, signUp, recoverUserInformation }
