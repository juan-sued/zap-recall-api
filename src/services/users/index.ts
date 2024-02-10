import { usersInterfaces } from '@/interfaces'
import { UpdateUserData } from '@/interfaces/users'
import { usersRepository } from '@/repositories'
import { errorFactory } from '@/utils'
import { User } from '@prisma/client'
import bcrypt from 'bcrypt'

async function getAllUsers(): Promise<usersInterfaces.IUserBasic[]> {
  const users = await usersRepository.getAll()

  return users
}

async function getByName(name: string): Promise<usersInterfaces.IUserBasic[]> {
  const users: usersInterfaces.IUserBasic[] =
    await usersRepository.getByFilterName(name)

  return users
}

async function getById(id: number): Promise<Omit<User, 'password'>> {
  const user = await usersRepository.getById(id)
  if (!user) throw errorFactory.notFound('User')
  return user
}

async function updateUserService(id: number, updateUserData: UpdateUserData) {
  if (updateUserData.password) {
    const passwordCripted = await bcrypt.hash(updateUserData.password, 10)
    updateUserData.password = passwordCripted
  }

  await usersRepository.update(id, updateUserData)
}

async function deleteUserService(id: number) {
  if (!id) throw errorFactory.unprocessableEntity(['id inexistent'])
  await usersRepository.exclude(id)
}

export { deleteUserService, getAllUsers, getById, getByName, updateUserService }
