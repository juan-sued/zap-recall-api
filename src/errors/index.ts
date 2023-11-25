import { NextFunction, Request, Response } from 'express'

function errorHandlerMiddleware(
  error: ErrorEvent,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  switch (error.type) {
    case 'error_unprocessable_entity':
      return res.status(422).send({ message: error.message })
    case 'error_not_found':
      return res.status(404).send({ message: error.message })
    case 'error_conflict':
      return res.status(409).send({ message: error.message })
    case 'error_unauthorized':
      return res.status(401).send({ message: error.message })
    case 'error_forbidden':
      return res.status(403).send({ message: error.message })
    default:
      res.status(500).send({ message: error.message })
  }
}

export { errorHandlerMiddleware }
