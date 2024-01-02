import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

function connectDb(): void {
  prisma = new PrismaClient({
    log: ['info', 'warn', 'error'],
  })
}

async function disconnectDB(): Promise<void> {
  await prisma?.$disconnect()
}

export { connectDb, disconnectDB, prisma }
