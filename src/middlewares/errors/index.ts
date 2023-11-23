import { NextFunction, Request, Response } from 'express';

function errorHandlerMiddleware(error: ErrorEvent, _req: Request, response: Response, _next: NextFunction) {
  switch (error.type) {
    case 'error_unprocessable_entity':
      return response.status(422).send({ message: error.message });
    case 'error_not_found':
      return response.status(404).send({ message: error.message });
    case 'error_conflict':
      return response.status(409).send({ message: error.message });
    case 'error_unauthorized':
      return response.status(401).send({ message: error.message });
    case 'error_forbidden':
      return response.status(403).send({ message: error.message });
    default:
      response.status(500).send({ message: error.message });
  }
}

export { errorHandlerMiddleware };
