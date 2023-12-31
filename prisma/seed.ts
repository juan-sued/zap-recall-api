import { Category, Difficulty, PrismaClient, Quiz, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { loadEnv } from '../src/config';
import { quizzesInterfaces } from '../src/interfaces';


const prisma = new PrismaClient()


async function main() {

  await cleanDB()
  loadEnv()

  console.log(process.env.DATABASE_URL)
  let userDB = await prisma.user.findFirst()

  if (!userDB) {
    try {
      const mockUser: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'phone'> = {
        name: 'Juan Sued',
        email: 'juansued22@gmail.com',
        password: '112316',
      };
  
      const passwordEncripted = await bcrypt.hash(mockUser.password, 10);
  
      userDB = await prisma.user.create({
        data: { ...mockUser, password: passwordEncripted },
      });
  
    } catch (error) {
      console.log('erro aqui', error);
    }
  }
  
  console.log('usuário:', userDB);

  let categoryDB = await prisma.category.findFirst()

  if (!categoryDB) {
    try {
      const mockCategory: Omit<Category, 'id'> = {
        title: 'Biologia',
      };

      categoryDB = await prisma.category.create({
        data: mockCategory,
      });

    } catch (error) {
      console.log('erro aqui', error);
    }
  }

  console.log('categoria:', categoryDB);



  let quizDB = await prisma.quiz.findFirst()


  if(!quizDB){
    const quizMock: quizzesInterfaces.INewQuiz = {
      title: "Deuterostomados",
      description: "Um quiz sobre deuterostomados",
      categoryId: categoryDB!.id,
      newCategory: "",
      difficulty: Difficulty.EASY,
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
    let { title, description, categoryId, newCategory, questions, difficulty } = quizMock;
    
    if (newCategory) {
      const data = {
        title: newCategory
      }
  
      const category: Category = await prisma.category.create({
        data
      })
  
      categoryId = category.id
    }
  
    const quiz: Omit<Quiz, 'id'> = {
      title,
      description,
      categoryId,
      difficulty,
      attempts: 0,
      percentEndings: 0,
      userId: userDB!.id
    }
    console.log('user aqui', quiz.userId)

  
    const quizCreated = await prisma.quiz.create({
      data: quiz
    })
  
    // cria um question e um identificador na tabela meio
    for (const question of questions) {
      const questionCreated = await prisma.question.create({
        data: question
      })
  
      await prisma.quizzyQuestion.create({
        data: {
          quizId: quizCreated.id,
          questionId: questionCreated.id
        }
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







  async function cleanDB(){
    await prisma.quizzyQuestion.deleteMany()
    await prisma.question.deleteMany()
    await prisma.quiz.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()
    }
