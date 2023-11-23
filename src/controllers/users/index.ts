import { Request, Response } from 'express';
import { ResponseAllUsers} from '@/interfaces/userInterfaces ';
import { usersService } from '@/services';
import { User } from '@prisma/client';
import { errorFactory } from '@/utils';


async function getUsersController(request: Request, response: Response) {
  const { name } = request.query as Record<string, string>;
  const { idParams } = response.locals;
  let result: ResponseAllUsers | Omit<User, 'id' | 'password' | 'updatedAt'>;

  if (name) result = await usersService.getUserByName(name);

  if (idParams) result = await usersService.getUserById(idParams);

  if (!name && !idParams) result = await usersService.getAllUsers();

  if (!result) throw errorFactory.notFound('user(s)');

  response.status(200).send(result);
}

async function updateUserController(request: Request, response: Response) {
  const { idUser } = response.locals;
  const updateUserData = request.body;
  console.log(idUser, updateUserData);
  await usersService.updateUserService(idUser, updateUserData);

  response.sendStatus(200);
}

async function deleteUserController(request: Request, response: Response) {
  const { idUser } = response.locals;

  await usersService.deleteUserService(idUser);

  response.sendStatus(200);
}

export { getUsersController, updateUserController, deleteUserController };
