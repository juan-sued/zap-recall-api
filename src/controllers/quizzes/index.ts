import { INewQuiz } from '@/interfaces/quizzes'
import { quizzesService } from '@/services'
import { errorFactory } from '@/utils'
import { Quiz } from '@prisma/client'
import { Request, Response } from 'express'

async function insert(request: Request, response: Response) {
  const newQuiz: INewQuiz = request.body
  const userId = response.locals.idUser

  await quizzesService.insert(newQuiz, 14)

  response.sendStatus(201)
}

async function get(request: Request, response: Response) {
  const { title } = request.query as Record<string, string>
  const { idParams } = response.locals
  let result: Partial<Quiz>[] | Partial<Quiz> | null = []

  if (title) result = await quizzesService.getByTitle(title)

  if (idParams) result = await quizzesService.getById(idParams)

  if (!title && !idParams) result = await quizzesService.getAll()

  if (result === null) throw errorFactory.notFound('Result')

  response.status(200).send(result)
}

// async function update(req: Request, res: Response) {
//   const { idParams } = res.locals
//   const { title } = req.body

//   const updatedCategories = await quizzesService.update(idParams, {
//     title
//   })

//   return res.status(200).send(updatedCategories)
// }

async function exclude(request: Request, response: Response) {
  const { idParams } = response.locals
  await quizzesService.exclude(idParams)

  response.sendStatus(200)
}

export { exclude, get, insert }
