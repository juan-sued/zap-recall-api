import { NextFunction, Request, Response } from 'express';
import { errorFactory } from '@/utils';

const validateIdParamsMiddleware = async (request: Request, response: Response, next: NextFunction) => {
  const { id } = request.params;
  if (!id) throw errorFactory.unprocessableEntity(['id inexistent']);

  response.locals.idParams = Number(id);
  next();
};

export { validateIdParamsMiddleware };
