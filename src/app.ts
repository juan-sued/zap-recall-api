import cors from 'cors'
import express, { Express, json } from 'express'
import 'express-async-errors'
import 'reflect-metadata'
import { errorHandlerMiddleware } from './errors'
import { usersRouter } from './routes'

const app = express()

app
  .use(cors())
  .use(json())
  .use('/users', usersRouter)
  .get('/health', (_req, res) => res.send('OK!'))

  .use(errorHandlerMiddleware)

export function init(): Promise<Express> {
  // connectDb();
  return Promise.resolve(app)
}

export async function close(): Promise<void> {
  // await disconnectDB();
}

export default app
