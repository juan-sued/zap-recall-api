import dotenv from 'dotenv';

import { Request, Response, NextFunction } from 'express';

import { errorFactory } from '@/utils/index';
import { decodedToken } from '@/services/auth/jwtToken';
import { usersRepository } from '@/repositories';

dotenv.config();

async function validateJwtTokenMiddleware(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.header('Authorization');
  if (!authHeader) throw errorFactory.unauthorized('authHeader');

  const token = authHeader.split(' ')[1];
  if (!token) throw errorFactory.unauthorized('token');
  const payload = await decodedToken(token);

  const user = await usersRepository.getUserOrAdministratorById(payload.id);

  if (!user) throw errorFactory.notFound('usuário inexistente');

  response.locals.idUser = payload.id;

  next();
}

const validateNotFoundEmailMiddleware = async (request: Request, response: Response, next: NextFunction) => {
  const { email } = request.body;

  const isRegisteredUser = await usersRepository.getUserByEmail(email);

  if (!isRegisteredUser) throw errorFactory.forbidden();

  response.locals.userInDB = isRegisteredUser;
  next();
};

export { validateJwtTokenMiddleware, validateNotFoundEmailMiddleware };
