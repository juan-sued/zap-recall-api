import { Category, PrismaClient, Quiz, User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { quizzesInterface } from '../src/interfaces'

const prisma = new PrismaClient()

async function main() {
  let userDB = await prisma.user.findFirst()

  if (userDB === null) {
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa',userDB)


      const mockUser: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'phone'> = {
        name: 'Juan Sued',
        email: 'juansued22@gmail.com',
        password: '112316',
      }

      const passwordEncripted = await bcrypt.hash(mockUser.password, 10)

      userDB = await prisma.user.create({
        data: { ...mockUser, password: passwordEncripted },
      })


    console.log('criado usuário: ', userDB)
  }

  let categoryDB = await prisma.category.findFirst()

  if (!categoryDB) {
      const mockCategory: Omit<Category, 'id'> = {
        title: 'Biologia',
      }
      categoryDB = await prisma.category.create({
        data: mockCategory,
      })

    console.log('criada categoria: ', categoryDB)
  }

  const quizDB = await prisma.quiz.findFirst()

  if(!quizDB){
    const quizMock: quizzesInterface.INewQuiz = {
      title: 'Deuterostomados',
      description: 'Um quiz sobre deuterostomados',
      categoryId: 1,
      newCategory: '',
      questions: [
        {
          question: 'Por que as aves engolem pedras?',
          response: 'Para realizar a trituração mecânica no organismo.',
        },
        {
          question: 'O que caracteriza os deuterostomados?',
          response:
            'O blastóporo origina o ânus durante o desenvolvimento embrionário.',
        },
        {
          question: 'Quais são os principais grupos de deuterostomados?',
          response: 'Equinodermos e cordados.',
        },
        {
          question: 'Cite um exemplo de cordado.',
          response: 'Sapinho-da-barriga-vermelha (Phyllomedusa bicolor).',
        },
      ],
    }

    if (quizMock.newCategory) {
      const data = {
        title: quizMock.newCategory,
      }

      const category: Category = await prisma.category.create({
        data,
      })

      quizMock.categoryId = category.id
    }

    const quiz: Omit<Quiz, 'id'> = {

     title: quizMock.title,
      description: quizMock.description,
      categoryId: quizMock.categoryId,
      userId: userDB!.id,
    }

    const quizCreated = await prisma.quiz.create({
      data: quiz,
    })

    // cria um question e um identificador na tabela meio
    for (const question of quizMock.questions) {
      const questionCreated = await prisma.question.create({
        data: question,
      })

      await prisma.quizzyQuestion.create({
        data: {
          quizId: quizCreated.id,
          questionId: questionCreated.id,
        },
      })
    }
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
