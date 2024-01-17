import { Difficulty, Question, Quiz } from '@prisma/client'

type NewQuestion = Omit<Question, 'id' | 'quizId'>

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

interface IAnswer {
  questionId: number
  answer: string
}

interface IObjRegisterAnswer {
  quizId: number
  answers: IAnswer[]
}

export { INewQuiz, IQuiz, NewQuestion, IAnswer, IObjRegisterAnswer }
