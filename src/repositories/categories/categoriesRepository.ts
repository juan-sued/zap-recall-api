import { prisma } from '@/config'
import { UpdateCategoriesData } from '@/interfaces/categories'
import { Category, Prisma } from '@prisma/client'

//= ================== GET =====================//

function getAll(): Promise<Category[]> {
  const params: Prisma.CategoryFindManyArgs = {}

  return prisma.category.findMany(params)
}
async function getById(id: number): Promise<Category> {
  const category = await prisma.category.findUnique({
    where: {
      id
    }
  })

  return category
}

function getByFilterName(name: string): Promise<Category[]> {
  const params: Prisma.CategoryFindManyArgs = {
    where: {
      title: {
        startsWith: `${name}`,
        mode: 'insensitive'
      }
    },
    skip: 0,
    take: undefined
  }

  return prisma.category.findMany(params)
}

//= ================ INSERT ===================//

async function insert(newCategories: Category) {
  await prisma.category.create({
    data: newCategories
  })
}

//= ================ UPDATE ===================//

async function update(id: number, updateCategoriesData: UpdateCategoriesData) {
  const params: Prisma.CategoryUpdateArgs = {
    where: { id },
    data: updateCategoriesData
  }

  await prisma.category.update(params)
}

//= ================ exclude ===================//

async function exclude(id: number) {
  await prisma.category.delete({ where: { id } })
}

export { exclude, getAll, getByFilterName, getById, insert, update }
