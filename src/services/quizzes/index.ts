import { prisma } from '@/config'
import { IAnswer, INewQuiz } from '@/interfaces/quizzes'
import { authMiddleware } from '@/middlewares'
import { quizzesRepository } from '@/repositories'
import { errorFactory } from '@/utils'
import { Category, Quiz } from '@prisma/client'

async function insert(
  {
    title,
    description,
    newCategory,
    categoryId,
    questions,
    difficulty,
  }: INewQuiz,
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
    difficulty,
    attempts: 0,
    percentEndings: 0,
    categoryId,
    userId,
  }

  console.log(quiz)
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

async function getAll(): Promise<Quiz[]> {
  const quizzes = await quizzesRepository.getAll()

  if (!quizzes) throw errorFactory.notFound('quizzes')

  return quizzes
}

async function getByTitle(title: string): Promise<Quiz[]> {
  const quizzes: Quiz[] = await quizzesRepository.getByFilterTitle(title)

  if (!quizzes) throw errorFactory.notFound('quizzes')

  return quizzes
}

async function getById(id: number): Promise<Partial<Quiz>> {
  const quiz = await quizzesRepository.getById(id)

  if (!quiz) throw errorFactory.notFound('quiz')

  return quiz
}

async function exclude(id: number) {
  await quizzesRepository.exclude(id)
}

// answer

interface IRegisterAnswerService {
  quizId: number | null
  userId: number | null
  answers: IAnswer[]
}

async function insertAnswer({
  quizId,
  userId,
  answers,
}: IRegisterAnswerService) {
  console.log(quizId, userId, answers)
}

const answer = { insertAnswer }

const quiz = {
  exclude,
  getAll,
  getById,
  getByTitle,
  insert,
}

export { quiz, answer }
