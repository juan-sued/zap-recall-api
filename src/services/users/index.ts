import { usersInterface } from '@/interfaces'
import { UpdateUserData, UsersBasic } from '@/interfaces/users'
import { usersRepository } from '@/repositories'
import { errorFactory } from '@/utils'
import { User } from '@prisma/client'
import bcrypt from 'bcrypt'

async function getAllUsers(): Promise<usersInterface.ResponseAllUsers> {
  const users: UsersBasic[] = await usersRepository.getAllUsers()

  return {
    users
  }
}

async function getUserByName(
  name: string
): Promise<usersInterface.ResponseAllUsers> {
  const users: UsersBasic[] = await usersRepository.getUsersByFilterName(name)

  return {
    users
  }
}

async function getUserById(
  id: number
): Promise<Omit<User, 'id' | 'password' | 'updatedAt'>> {
  const user: User = await usersRepository.getUserOrAdministratorById(id)
  return user
}

async function updateUserService(id: number, updateUserData: UpdateUserData) {
  if (updateUserData.password) {
    const passwordCripted = await bcrypt.hash(updateUserData.password, 10)
    updateUserData.password = passwordCripted
  }

  await usersRepository.updateUser(id, updateUserData)
}

async function deleteUserService(id: number) {
  if (!id) throw errorFactory.unprocessableEntity(['id inexistent'])
  await usersRepository.deleteUser(id)
}

export {
  deleteUserService,
  getAllUsers,
  getUserById,
  getUserByName,
  updateUserService
}
