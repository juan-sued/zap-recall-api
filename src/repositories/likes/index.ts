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
async function verifyIfLikeByQuizIdAndPlayerId({
  quizId,
  playerId,
}: IGetLikedQuizByQuizId) {
  const isLiked = await prisma.historic.findFirst({
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
      like: {
        select: {
          likeStatus: true,
        },
      },
    },
  })
  return isLiked
}
export { insert, verifyIfLikeByQuizIdAndPlayerId, getById }
