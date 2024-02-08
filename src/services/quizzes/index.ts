import { prisma } from '@/config'
import { INewQuiz, IHistoricBody, IMetaData } from '@/interfaces/quizzes'
import {
  answersRepository,
  historicRepository,
  likesRepository,
  quizzesRepository,
} from '@/repositories'
import { errorFactory } from '@/utils'
import { Category, Quiz } from '@prisma/client'
import { Request } from 'express'
import { decodedToken } from '../auth/jwtToken'

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

  const quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'> = {
    title,
    description,
    difficulty,
    attempts: 0,
    endings: 0,
    categoryId,
    userId,
  }

  const quizCreated = await prisma.quiz.create({
    data: quiz,
  })

  for (const question of questions) {
    const newQuestion = {
      quizId: quizCreated.id,
      question: question.question,
      response: question.response,
    }

    await prisma.question.create({
      data: newQuestion,
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

interface IGetById {
  request: Request
  idParams: number
}

interface IQuizWithLike extends Partial<Quiz> {
  isLiked: boolean
}

async function getById({
  request,
  idParams,
}: IGetById): Promise<Partial<Quiz>> {
  const quiz = await quizzesRepository.getById(idParams)
  if (!quiz) throw errorFactory.notFound('quiz')

  const quizWithLike: IQuizWithLike = { ...quiz, isLiked: null }

  const authHeader = request.header('Authorization')

  if (authHeader) {
    const token = authHeader.split(' ')[1]
    if (!token) throw errorFactory.unauthorized('token')

    const payload = await decodedToken(token)

    const userId = payload.id

    const liked = await likesRepository.getLikeByQuizIdAndPlayerId({
      playerId: userId,
      quizId: quiz.id,
    })

    if (liked) quizWithLike.isLiked = liked.like.likeStatus
  }
  return quizWithLike
}

async function exclude(id: number) {
  await quizzesRepository.exclude(id)
}

// answer

interface IInsertHistoricService extends IHistoricBody {
  playerId: number
}

async function insertHistoric({
  quizId,
  playerId,
  answers,
  isLiked,
}: IInsertHistoricService) {
  // valida se existe histico onde o likeStatus !== null  -> ja deu like nesse quiz
  const isQuizLiked = await likesRepository.getLikeByQuizIdAndPlayerId({
    playerId,
    quizId,
  })
  let likeId: number | null = null

  if (isQuizLiked) {
    likeId = isQuizLiked.like.id
  } else {
    const like = await likesRepository.insert({
      likeStatus: isLiked,
    })
    likeId = like.id
  }
  const historic = await historicRepository.insert({
    playerId,
    quizId,
    likeId,
  })

  for (const answerUnit of answers) {
    const { questionId, answer } = answerUnit
    await answersRepository.insert({
      questionId,
      response: answer,
      historicId: historic.id,
    })
  }
  await incrementAttempt({ answers, quizId })

  // criar um answer para cada resposta
}

export type TIncrementAttempt = Omit<IHistoricBody, 'isLiked'>

async function incrementAttempt({ answers, quizId }: TIncrementAttempt) {
  const answersZaps = answers.filter((answer) => answer.answer === 'zap')

  const isFinishedWin = answersZaps.length === answers.length

  await quizzesRepository.incrementAttempt({ isFinishedWin, quizId })
}

async function getHistoricById(id: string) {
  if (!id) throw errorFactory.unprocessableEntity(['id inexistent'])
  const historic = await historicRepository.getById(Number(id))

  if (!historic) throw errorFactory.notFound('Historic')

  return historic
}

async function getHistoricByPlayer(playerId: number) {
  const historic = await historicRepository.getAllByPlayerId(playerId)

  if (!historic) throw errorFactory.notFound('Historic')

  return historic
}
async function getHistoricByAuthor(userId: number) {
  const historic = await historicRepository.getAllByAuthor(userId)

  if (!historic) throw errorFactory.notFound('Historic')

  return historic
}

async function getHistoricMetaData(userId: number): Promise<IMetaData> {
  const historicList = await getHistoricByAuthor(userId)

  const historicLikedsList = historicList.filter(
    (historic) => historic.like.likeStatus === true,
  )
  // Pega o quiz mais curtido
  const mostPresentQuiz = historicLikedsList.reduce(
    (mostPresent, historic) => {
      const currentQuizId = historic.quiz.id
      const currentOccurrences = historicLikedsList.filter(
        (h) => h.quiz.id === currentQuizId,
      ).length

      if (currentOccurrences > mostPresent.occurrences) {
        return {
          quiz: historic.quiz,
          occurrences: currentOccurrences,
        }
      } else {
        return mostPresent
      }
    },
    { quiz: null, occurrences: 0 },
  )
  const historicDislikedsList = historicList.filter(
    (historic) => historic.like.likeStatus === false,
  )

  const allZaps = await quizzesRepository.getAllByAuthorId(userId)

  const totalEndings: number = allZaps.reduce(
    (accumulator, zap) => accumulator + zap.endings,
    0,
  )
  const avarageCompletion = Math.round(totalEndings / allZaps.length)
  const avarageLikes = Math.round(historicLikedsList.length / allZaps.length)
  const avarageDislikes = Math.round(
    historicDislikedsList.length / allZaps.length,
  )

  const percentConclusion =
    !mostPresentQuiz.quiz || mostPresentQuiz.quiz.attempts === 0
      ? 0
      : Math.round(
          (mostPresentQuiz.quiz.endings / mostPresentQuiz.quiz.attempts) * 100,
        )

  const likes = {
    totalLikes: historicLikedsList.length,
    averageLikes: isNaN(avarageLikes) ? 0 : avarageLikes,

    totalDislikes: historicDislikedsList.length,
    averageDislikes: isNaN(avarageDislikes) ? 0 : avarageDislikes,
  }

  const monthNames: string[] = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ]

  interface MonthlyTotal {
    name: string
    total: number
  }

  const monthlyTotals: Record<string, number> = {}

  for (const historic of historicList) {
    const monthName: string = monthNames[historic.createdAt.getMonth()]

    if (!monthlyTotals[monthName]) {
      monthlyTotals[monthName] = 1
    } else {
      monthlyTotals[monthName]++
    }
  }

  // Converter o objeto em um array
  const monthlyTotalsArray: MonthlyTotal[] = monthNames.map(
    (monthName: string) => ({
      name: monthName,
      total: monthlyTotals[monthName] || 0,
    }),
  )
  const zaps = {
    totalZaps: allZaps.length,
    averageCompletion: isNaN(avarageCompletion)
      ? 0
      : Math.round(avarageCompletion * 100),
    championZap: {
      quiz: mostPresentQuiz.quiz,
      percentConclusion,
      totalLikes: mostPresentQuiz.occurrences,
    },
    playersPerMonth: monthlyTotalsArray,
    playersCount: historicList.length,
    recentsCreatedZaps: allZaps,
  }

  return {
    likes,
    zaps,
  }
}

const historic = {
  insertHistoric,
  getHistoricById,
  getHistoricByPlayer,
  getHistoricByAuthor,
  getHistoricMetaData,
}

const quiz = {
  exclude,
  getAll,
  getById,
  getByTitle,
  insert,
  incrementAttempt,
}

export { quiz, historic }
