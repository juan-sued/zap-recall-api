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

  const quiz: Omit<Quiz, 'id'> = {
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

async function getById({
  request,
  idParams,
}: IGetById): Promise<Partial<Quiz>> {
  const quiz = await quizzesRepository.getById(idParams)
  if (!quiz) throw errorFactory.notFound('quiz')

  const quizWithLike: any = { ...quiz, isLiked: null }

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

  // criar um answer para cada resposta
}
async function incrementAttempt(quizId: number) {
  await quizzesRepository.incrementAttempt(quizId)
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
  const likes = await likesRepository.getLikesByAuthorId(userId)

  if (!likes) throw errorFactory.notFound('Like')

  return likes
}

async function getHistoricMetaData(userId: number): Promise<IMetaData> {
  const historicList = await getHistoricByAuthor(userId)
  if (!historicList.length) throw errorFactory.notFound('Historic')

  const historicLikedsList = historicList.filter(
    (historic) => historic.like.likeStatus === true,
  )
  const historicDislikedsList = historicList.filter(
    (historic) => historic.like.likeStatus === false,
  )

  const averageLikes =
    historicList.length > 0
      ? historicLikedsList.length / historicList.length
      : 0

  const averageDislikes =
    historicList.length > 0
      ? historicDislikedsList.length / historicList.length
      : 0
  const likes = {
    totalLikes: historicLikedsList.length,
    averageLikes: Number(averageLikes.toFixed(2)),

    totalDislikes: historicDislikedsList.length,
    averageDislikes: Number(averageDislikes.toFixed(2)),
  }

  const zaps = {
    totalCompletion: 0,
    averageCompletion: 0,
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
