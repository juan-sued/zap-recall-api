import { Request, Response } from 'express';

import { ISign, ISignUp } from '@/interfaces/auth';
import { authService } from '@/services';

 async function registerUserController(request: Request, response: Response) {
  const newUser: ISignUp = request.body;

  await authService.signUpService(newUser);

  response.sendStatus(201);
}

type LoginResponse = {
  user: {
    id: number;
    name: string;
  };
  token: string;
};

 async function loginUserController(request: Request, response: Response) {
  const userLogin: ISign = request.body;
  const { userInDB } = response.locals;
  const access = userInDB.typeOfUser;
  const loginResponse: LoginResponse = await authService.signInService(userLogin, userInDB);
  response.status(200).send(loginResponse);
}



export {
  loginUserController, registerUserController
};

