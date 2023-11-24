import { prisma } from '@/config';
import { UpdateCategoriesData } from '@/interfaces/categories';
import { Category, Prisma } from '@prisma/client';

//=================== GET =====================//

function getAllCategories(): Promise<Category[]> {
  const params: Prisma.CategoryFindManyArgs = {};

  return prisma.category.findMany(params);
}
async function getCategoriesById(id: number): Promise<Category> {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  return category;
}

function getCategoriesWithStock(): Promise<Category[]> {
  const params: Prisma.CategoryFindManyArgs = {
    include: {

    },
  };

  return prisma.category.findMany(params);
}
function getCategoriesByFilterName(name: string): Promise<Category[]> {
  const params: Prisma.CategoryFindManyArgs = {
    where: {
      category: {
        startsWith: `${name}`,
        mode: 'insensitive',
      },
    },
    skip: 0,
    take: undefined,
  };

  return prisma.category.findMany(params);
}

//================= INSERT ===================//

async function insertCategories(newCategories: Category) {
  await prisma.category.create({
    data: newCategories,
  });
}

//================= UPDATE ===================//

async function updateCategories(id: number, updateCategoriesData: UpdateCategoriesData) {
  const params: Prisma.CategoryUpdateArgs = {
    where: { id },
    data: updateCategoriesData,
  };

  await prisma.category.update(params);
}

//================= DELETE ===================//

async function deleteCategories(id: number) {
  await prisma.category.delete({ where: { id } });
}

export {
    deleteCategories, getAllCategories,
    getCategoriesByFilterName, getCategoriesById, getCategoriesWithStock, insertCategories, updateCategories
};

