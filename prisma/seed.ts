import { Category, PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { quizzesInterface } from '../src/interfaces';
import { quizzesService } from '../src/services';



const prisma = new PrismaClient()


async function main() {



  let userDB = await prisma.user.findFirst()

  if (!userDB){
    async () => {
      const mockUser: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'phone'>  = {
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

  let categoryDB = await prisma.category.findFirst()

  if (!categoryDB){
    async () => {
      const mockCategory: Omit<Category, 'id'> = {
        title: 'Biologia'
      }
      categoryDB = await prisma.category.create({
        data: mockCategory,
      })

    }
    console.log( 'criada categoria: ', categoryDB )

  }



  let quizDB = await prisma.quiz.findFirst()


  const quizMock: quizzesInterface.INewQuiz = {
    title: "Deuterostomados",
    description: "Um quiz sobre deuterostomados",
    categoryId: 1,
    newCategory: "",
    questions: [
      {
        question: "Por que as aves engolem pedras?",
        response: "Para realizar a trituração mecânica no organismo."
      },
      {
        question: "O que caracteriza os deuterostomados?",
        response: "O blastóporo origina o ânus durante o desenvolvimento embrionário."
      },
      {
        question: "Quais são os principais grupos de deuterostomados?",
        response: "Equinodermos e cordados."
      },
      {
        question: "Cite um exemplo de cordado.",
        response: "Sapinho-da-barriga-vermelha (Phyllomedusa bicolor)."
      }
    ]
  };


  if(!quizDB) await quizzesService.insertQuiz({ quizMock }, 2)


}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
