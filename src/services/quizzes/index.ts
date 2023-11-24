import { prisma } from '@/config'
import { INewQuiz } from '@/interfaces/quizzes'
import { Category, Quiz } from '@prisma/client'

async function insertQuiz(
  { title, description, newCategory, categoryId, questions }: INewQuiz,
  userId: number,
) {
  if (newCategory) {
    const data = {
      title: newCategory,
    }

    const category: Category = await prisma.category.create({
      data,
    })

    categoryId = category.id
  }

  const quiz: Omit<Quiz, 'id'> = {
    title,
    description,
    categoryId,
    userId,
  }

  const quizCreated = await prisma.quiz.create({
    data: quiz,
  })

  // cria um question e um identificador na tabela meio
  for (const question of questions) {
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

export { insertQuiz }

