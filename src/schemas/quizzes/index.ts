import Joi from 'joi'

const quiz = Joi.object({
  title: Joi.string().trim().min(1).trim().min(1).required(),
  description: Joi.string().trim().min(1).required(),
  categoryId: Joi.number().allow(null).optional(),
  newCategory: Joi.string().trim().allow('').optional(),
  difficulty: Joi.string().trim().valid('EASY', 'MEDIUM', 'HARD').required(),
  questions: Joi.array()
    .min(1)
    .items({
      question: Joi.string().trim().min(1).required(),
      response: Joi.string().trim().min(1).required()
    })
    .required()
})

export { quiz }
