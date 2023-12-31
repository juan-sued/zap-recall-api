import { Difficulty, Question, Quiz } from '@prisma/client'

type NewQuestion = Omit<Question, 'id'>

interface INewQuiz {
  title: string
  description: string
  categoryId: number
  newCategory: string
  difficulty: Difficulty
  questions: NewQuestion[]
}

interface IQuiz extends Quiz {
  questions: Question[]
}

export { INewQuiz, IQuiz, NewQuestion }
