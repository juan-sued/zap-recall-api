import { usersController } from '@/controllers'
import { Router } from 'express'

const usersRouter = Router()

usersRouter.get('/', usersController.getUser)

export { usersRouter }
