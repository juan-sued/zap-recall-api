import { INewCategory, IUpdateCategoriesData } from '@/interfaces/categories'
import { categoriesRepository } from '@/repositories'
import { errorFactory } from '@/utils'
import { Category } from '@prisma/client'

async function insert(newCategories: INewCategory) {
  await categoriesRepository.insert(newCategories)
}

async function getAll(): Promise<Category[]> {
  const categories = await categoriesRepository.getAll()
  if (!categories) throw errorFactory.notFound('categories')

  return categories
}

async function getByTitle(title: string): Promise<Category[]> {
  const categories: Category[] =
    await categoriesRepository.getByFilterTitle(title)

  if (!categories) throw errorFactory.notFound('categories')

  return categories
}

async function getById(id: number): Promise<Category> {
  const categories: Category = await categoriesRepository.getById(id)
  if (!categories) throw errorFactory.notFound('categories')

  return categories
}

async function update(id: number, updateCategoriesData: IUpdateCategoriesData) {
  await categoriesRepository.update(id, updateCategoriesData)
}

async function exclude(id: number) {
  await categoriesRepository.exclude(id)
}

export { exclude, getAll, getById, getByTitle, insert, update }
