import Joi from 'joi'

const categorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required()
})
const categoryUpdateSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string()
})

export { categorySchema, categoryUpdateSchema }
