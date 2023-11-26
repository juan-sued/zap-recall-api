import { usersInterfaces } from '@/interfaces'
import { UpdateUserData, UsersBasic } from '@/interfaces/users'
import { usersRepository } from '@/repositories'
import { errorFactory } from '@/utils'
import { User } from '@prisma/client'
import bcrypt from 'bcrypt'

async function getAllUsers(): Promise<usersInterfaces.ResponseAllUsers> {
  const users: UsersBasic[] = await usersRepository.getAll()

  return {
    users
  }
}

async function getByName(
  name: string
): Promise<usersInterfaces.ResponseAllUsers> {
  const users: UsersBasic[] = await usersRepository.getByFilterName(name)

  return {
    users
  }
}

async function getById(
  id: number
): Promise<Omit<User, 'id' | 'password' | 'updatedAt'>> {
  const user: User = await usersRepository.getById(id)
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
