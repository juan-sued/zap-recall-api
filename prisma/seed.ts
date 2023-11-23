import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()


async function main() {



  let userDB = await prisma.user.findFirst()

  if (!userDB){
    async () => {
      const mockUser = {
        name: 'Juan Sued',
        email: 'juansued22@gmail.com',
        password: '112316',
      }

      const passwordEncripted = await bcrypt.hash(mockUser.password, 10)
      userDB = await prisma.user.create({
        data: { ...mockUser, password: passwordEncripted },
      })

    }
    console.log( 'criado usuário: ', userDB )

  }

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
