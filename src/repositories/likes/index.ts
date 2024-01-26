import { prisma } from '@/config'
import { Like } from '@prisma/client'

async function insert(data: Omit<Like, 'id' | 'createdAt'>) {
  const like = await prisma.like.create({
    data,
  })

  return like
}
async function getById(likeId: number) {
  const like = await prisma.like.findUnique({
    where: {
      id: likeId,
    },
  })

  return like
}

interface IGetLikedQuizByQuizId {
  quizId: number
  playerId: number
}
async function getLikeByQuizIdAndPlayerId({
  quizId,
  playerId,
}: IGetLikedQuizByQuizId) {
  const like = await prisma.historic.findFirst({
    where: {
      quizId,
      playerId,
      like: {
        likeStatus: {
          not: null,
        },
      },
    },
    select: {
      like: true,
    },
  })
  return like
}

async function getLikesByAuthorId(userId: number) {
  const likes = await prisma.historic.findMany({
    where: {
      quiz: {
        userId,
      },
    },
    select: {
      like: true,
      quiz: true,
    },
  })
  return likes
}

export { insert, getLikeByQuizIdAndPlayerId, getById, getLikesByAuthorId }
