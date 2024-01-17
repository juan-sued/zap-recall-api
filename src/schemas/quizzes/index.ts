import Joi from 'joi'

const question = {
  question: Joi.string().trim().min(1).required(),
  response: Joi.string().trim().min(1).required(),
}
const quiz = Joi.object({
  title: Joi.string().trim().min(1).trim().min(1).required(),
  description: Joi.string().trim().min(1).required(),
  categoryId: Joi.number().allow(null).optional(),
  newCategory: Joi.string().trim().allow('').optional(),
  difficulty: Joi.string().trim().valid('EASY', 'MEDIUM', 'HARD').required(),
  questions: Joi.array().min(1).items(question).required(),
})

const answer = Joi.object({
  questionId: Joi.number().required(),
  answer: Joi.string().required(),
})

const objRegisterAnswer = Joi.object({
  quizId: Joi.number().required(),
  answers: Joi.array().items(answer).min(1).required(),
})

export { quiz, objRegisterAnswer }
