import cors from 'cors'
import express, { Express, json } from 'express'
import 'express-async-errors'
import 'reflect-metadata'
import { connectDb, disconnectDB, loadEnv } from './config'
import { errorHandlerMiddleware } from './errors'
import { authRouter, categoriesRouter, usersRouter } from './routes'
import { quizzesRouter } from './routes/quizzes'

loadEnv()

const app = express()

app
  .use(cors())
  .use(json())
  .use('/auth', authRouter)
  .use('/users', usersRouter)
  .use('/categories', categoriesRouter)
  .use('/quizzes', quizzesRouter)
  .get('/health', (_req, res) => res.send('OK!'))

  .use(errorHandlerMiddleware)

export function init(): Promise<Express> {
  connectDb()
  return Promise.resolve(app)
}

export async function close(): Promise<void> {
  await disconnectDB()
}

export default app
