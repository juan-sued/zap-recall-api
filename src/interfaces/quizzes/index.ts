import { Question } from '@prisma/client'

type NewQuestion = Omit<Question, 'id'>

interface INewQuiz {
  title: string
  description: string
  categoryId: number
  newCategory: string
  questions: NewQuestion[]
}

export { INewQuiz, NewQuestion }
