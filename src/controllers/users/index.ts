import { ResponseAllUsers } from '@/interfaces/users'
import { usersService } from '@/services'
import { errorFactory } from '@/utils'
import { User } from '@prisma/client'
import { Request, Response } from 'express'

async function get(request: Request, response: Response) {
  const { name } = request.query as Record<string, string>
  const { idParams } = response.locals
  let result: ResponseAllUsers | Omit<User, 'id' | 'password' | 'updatedAt'>

  if (name) result = await usersService.getByName(name)

  if (idParams) result = await usersService.getById(idParams)

  if (!name && !idParams) result = await usersService.getAllUsers()

  if (!result) throw errorFactory.notFound('user(s)')

  response.status(200).send(result)
}

async function update(request: Request, response: Response) {
  const { idUser } = response.locals
  const updateUserData = request.body
  console.log(idUser, updateUserData)
  await usersService.updateUserService(idUser, updateUserData)

  response.sendStatus(200)
}

async function exclude(request: Request, response: Response) {
  const { idUser } = response.locals

  await usersService.deleteUserService(idUser)

  response.sendStatus(200)
}

export { exclude, get, update }
