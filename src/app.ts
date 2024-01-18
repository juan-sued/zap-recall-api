import cors from 'cors'
import express, { Express, json } from 'express'
import 'express-async-errors'
import 'reflect-metadata'
import { connectDb, disconnectDB, loadEnv } from './config'
import { errorHandlerMiddleware } from './errors'
import {
  authRouter,
  categoriesRouter,
  historicRouter,
  usersRouter,
  quizzesRouter,
} from './routes'

loadEnv()

const app = express()
console.log(process.env.NODE_ENV)
app
  .use(cors())
  .use(json())
  .use('/auth', authRouter)
  .use('/users', usersRouter)
  .use('/categories', categoriesRouter)
  .use('/quizzes', quizzesRouter)
  .use('/historic', historicRouter)
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
