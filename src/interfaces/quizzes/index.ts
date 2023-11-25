import { Question } from '@prisma/client'

export type NewQuestion = Omit<Question, 'id'>

export interface INewQuiz {
  title: string
  description: string
  categoryId: number
  newCategory: string
  questions: NewQuestion[]
}
