import { resultGetUsers } from '@/interfaces/users'
import { usersService } from '@/services'
import { errorFactory } from '@/utils'
import { Request, Response } from 'express'

async function get(request: Request, response: Response) {
  const { name } = request.query as Record<string, string>
  const { idParams } = response.locals
  let result: resultGetUsers

  if (name) result = await usersService.getByName(name)

  if (idParams) result = await usersService.getById(idParams)

  if (!name && !idParams) result = await usersService.getAllUsers()

  if (!result) throw errorFactory.notFound('user(s)')

  response.status(200).send(result)
}

async function update(request: Request, response: Response) {
  const { userId } = response.locals
  const updateUserData = request.body
  await usersService.updateUserService(userId, updateUserData)

  response.sendStatus(200)
}

async function exclude(request: Request, response: Response) {
  const { userId } = response.locals

  await usersService.deleteUserService(userId)

  response.sendStatus(200)
}

export { exclude, get, update }
