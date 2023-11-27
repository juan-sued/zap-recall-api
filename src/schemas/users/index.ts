import Joi from 'joi'

const userUpdate = Joi.object({
  name: Joi.string().trim().min(1),
  email: Joi.string().email().trim().min(1),
  password: Joi.string().trim().min(1),
  typeOfUserId: Joi.number().min(0),
  cpf: Joi.string().trim().min(11),
  phone: Joi.string().trim().min(11)
})

export { userUpdate }
