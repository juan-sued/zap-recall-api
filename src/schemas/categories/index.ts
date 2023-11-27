import Joi from 'joi'

const category = Joi.object({
  title: Joi.string().required()
})
const categoryUpdate = Joi.object({
  title: Joi.string()
})

export { category, categoryUpdate }
