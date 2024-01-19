import { prisma } from '@/config'
import { Answer } from '@prisma/client'

async function insert(data: Omit<Answer, 'id' | 'createdAt'>) {
  await prisma.answer.create({
    data,
  })
}

export { insert }
