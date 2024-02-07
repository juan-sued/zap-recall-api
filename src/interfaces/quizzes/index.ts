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

interface IChampionZap {
  quiz: Partial<Quiz>
  percentConclusion: number
  totalLikes: number
}

interface IPlayersPerMonth {
  name: string
  total: number
}
interface IZapMetaData {
  totalZaps: number
  averageCompletion: number
  championZap: IChampionZap
  recentsCreatedZaps: Partial<Quiz>[]
  playersCount: number
  playersPerMonth: IPlayersPerMonth[]
}
interface IMetaData {
  likes: ILikeMetaData
  zaps: IZapMetaData
}

export { INewQuiz, IQuiz, NewQuestion, IAnswer, IHistoricBody, IMetaData }
