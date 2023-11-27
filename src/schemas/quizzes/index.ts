import Joi from 'joi'

const quiz = Joi.object({
  title: Joi.string().trim().min(1).trim().min(1).required(),
  description: Joi.string().trim().min(1).required(),
  categoryId: Joi.number().required(),
  newCategory: Joi.string().trim().min(1).allow(''),
  questions: Joi.array()
    .min(1)
    .items({
      question: Joi.string().trim().min(1).required(),
      response: Joi.string().trim().min(1).required()
    })
    .required()
})

export { quiz }
