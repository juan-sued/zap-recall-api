import { errorFactory } from '@/utils'
import { NextFunction, Request, Response } from 'express'
import { Schema } from 'joi'

const validateSchema = (schema: Schema) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const body: object = request.body
    const { error } = schema.validate(body, { abortEarly: false })

    if (error !== undefined) {
      const messages: string[] = error?.details.map((detail) => detail.message)

      throw errorFactory.unprocessableEntity(messages)
    }

    next()
  }
}

export { validateSchema }
