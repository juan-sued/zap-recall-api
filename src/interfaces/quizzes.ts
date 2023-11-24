import { Question } from "@prisma/client";



export interface INewQuiz {
  title: string;
  description: string;
  categoryId: number;
  newCategory: string;
  questions: NewQuestion[];
}

export type NewQuestion = Omit<Question, 'id' >;



