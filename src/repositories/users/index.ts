import { prisma } from '@/config'
import { authInterfaces, usersInterfaces } from '@/interfaces'
import { UpdateUserData } from '@/interfaces/users'
import { errorFactory } from '@/utils'
import { Prisma, User } from '@prisma/client'

//= ================== GET =====================//

async function getAll(): Promise<usersInterfaces.IUserBasic[]> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  })

  return users
}

function getByEmail(email: string) {
  const params: Prisma.UserFindUniqueArgs = {
    where: {
      email,
    },
  }

  return prisma.user.findUnique(params)
}

async function getById(id: number): Promise<Omit<User, 'password'> | null> {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  return user
}

function getByFilterName(name: string): Promise<usersInterfaces.IUserBasic[]> {
  const params: Prisma.UserFindManyArgs = {
    where: {
      name: {
        startsWith: `${name}`,
        mode: 'insensitive',
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
    skip: 0,
    take: undefined,
  }

  return prisma.user.findMany(params)
}

//= ================ INSERT ===================//

async function insert(newUser: authInterfaces.ISignUpRequest) {
  return await prisma.user.create({ data: newUser })
}

//= ================ UPDATE ===================//

async function update(id: number, updateUserData: UpdateUserData) {
  const resultUsers = await prisma.user.update({
    where: { id },
    data: updateUserData,
  })

  if (!resultUsers) throw errorFactory.notFound('User')
}

async function exclude(id: number) {
  await prisma.user.delete({ where: { id } })
}

export { exclude, getAll, getByEmail, getByFilterName, getById, insert, update }
