import { UpdateCategoriesData } from '@/interfaces/categories'
import { categoriesRepository } from '@/repositories'
import { errorFactory } from '@/utils'
import { Category } from '@prisma/client'

async function insertCategories(newCategories: Category) {
  await categoriesRepository.insertCategories(newCategories)
}

async function getAllCategories(): Promise<Category[]> {
  const categories = await categoriesRepository.getAllCategories()
  if (!categories) throw errorFactory.notFound('categories')

  return categories
}

async function getCategoriesByName(name: string): Promise<Category[]> {
  const categories: Category[] =
    await categoriesRepository.getCategoriesByFilterName(name)

  if (!categories) throw errorFactory.notFound('categories')

  return categories
}

async function getCategoriesById(id: number): Promise<Category> {
  const categories: Category = await categoriesRepository.getCategoriesById(id)
  if (!categories) throw errorFactory.notFound('categories')

  return categories
}

async function updateCategories(
  id: number,
  updateCategoriesData: UpdateCategoriesData
) {
  await categoriesRepository.updateCategories(id, updateCategoriesData)
}

async function deleteCategories(id: number) {
  await categoriesRepository.deleteCategories(id)
}

export {
  deleteCategories,
  getAllCategories,
  getCategoriesById,
  getCategoriesByName,
  insertCategories,
  updateCategories
}
