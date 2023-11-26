import { UpdateCategoriesData } from '@/interfaces/categories'
import { categoriesRepository } from '@/repositories'
import { errorFactory } from '@/utils'
import { Category } from '@prisma/client'

async function insert(newCategories: Category) {
  await categoriesRepository.insert(newCategories)
}

async function getAll(): Promise<Category[]> {
  const categories = await categoriesRepository.getAll()
  if (!categories) throw errorFactory.notFound('categories')

  return categories
}

async function getByName(name: string): Promise<Category[]> {
  const categories: Category[] =
    await categoriesRepository.getByFilterName(name)

  if (!categories) throw errorFactory.notFound('categories')

  return categories
}

async function getById(id: number): Promise<Category> {
  const categories: Category = await categoriesRepository.getById(id)
  if (!categories) throw errorFactory.notFound('categories')

  return categories
}

async function update(id: number, updateCategoriesData: UpdateCategoriesData) {
  await categoriesRepository.update(id, updateCategoriesData)
}

async function exclude(id: number) {
  await categoriesRepository.exclude(id)
}

export { exclude, getAll, getById, getByName, insert, update }
