import { prisma } from '@/config'
import { users } from '@prisma/client'
import bcrypt from 'bcrypt'
import faker from 'vitest-faker'

export async function createUser(params: Partial<users> = {}): Promise<users> {
  const incomingPassword = params.password || faker.internet.password(6)
  const hashedPassword = await bcrypt.hash(incomingPassword, 10)

  return prisma.users.create({
    data: {
      name: params.name || faker.internet.userName(),
      email: params.email || faker.internet.email(),
      password: hashedPassword,
      typeOfUserId: params.typeOfUserId
    }
  })
}
