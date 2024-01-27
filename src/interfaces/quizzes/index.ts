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

interface IHistoricBody {
  quizId: number
  answers: IAnswer[]
  isLiked: boolean | null
}

interface ILikeMetaData {
  totalLikes: number
  averageLikes: number
  totalDislikes: number
  averageDislikes: number
}
interface IZapMetaData {
  totalCompletion: number
  averageCompletion: number
}
interface IMetaData {
  likes: ILikeMetaData
  zaps: IZapMetaData
}

export { INewQuiz, IQuiz, NewQuestion, IAnswer, IHistoricBody, IMetaData }
