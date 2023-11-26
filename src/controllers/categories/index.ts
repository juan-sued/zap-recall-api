import { categoriesService } from '@/services'
import { Category } from '@prisma/client'
import { Request, Response } from 'express'

async function insert(request: Request, response: Response) {
  const newCategories: Category = request.body
  await categoriesService.insert(newCategories)

  response.sendStatus(201)
}

async function get(request: Request, response: Response) {
  const { name } = request.query as Record<string, string>
  const { idParams } = response.locals
  let result: Category[] | Category = []
  if (name) result = await categoriesService.getByName(name)

  if (idParams) result = await categoriesService.getById(idParams)

  if (!name && !idParams) result = await categoriesService.getAll()

  response.status(200).send(result)
}

async function update(req: Request, res: Response) {
  const { idParams } = res.locals
  const { name, description } = req.body

  const updatedCategories = await categoriesService.update(idParams, {
    name,
    description
  })

  return res.status(200).send(updatedCategories)
}

async function exclude(request: Request, response: Response) {
  const { idParams } = response.locals
  await categoriesService.exclude(idParams)

  response.sendStatus(200)
}

export { exclude, get, insert, update }
