import { Category } from "@prisma/client";
import { categoriesService } from '@/services';
import { Request, Response } from 'express';

async function insertCategories(request: Request, response: Response) {
  const newCategories: Category = request.body;
  await categoriesService.insertCategories(newCategories);

  response.sendStatus(201);
}

async function getCategories(request: Request, response: Response) {
  const { name } = request.query as Record<string, string>;
  const { idParams } = response.locals;
  let result: Category[] | Category = [];
  if (name) result = await categoriesService.getCategoriesByName(name);

  if (idParams) result = await categoriesService.getCategoriesById(idParams);

  if (!name && !idParams) result = await categoriesService.getAllCategories();

  response.status(200).send(result);
}

async function updateCategories(req: Request, res: Response) {
  const { idParams } = res.locals;
  const { name, description } = req.body;

  const updatedCategories = await categoriesService.updateCategories(idParams, {
    name,
    description,
  });

  return res.status(200).send(updatedCategories);
}

async function deleteCategories(request: Request, response: Response) {
  const { idParams } = response.locals;
  console.log('entrou');
  await categoriesService.deleteCategories(idParams);

  response.sendStatus(200);
}

export { getCategories, insertCategories, updateCategories, deleteCategories };
