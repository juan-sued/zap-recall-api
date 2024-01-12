import Joi from 'joi'

const signUp = Joi.object({
  name: Joi.string().trim().required().min(1),
  email: Joi.string().email().trim().required().min(1),
  password: Joi.string().trim().required().min(6),
  confirmPassword: Joi.ref('password'),
})

const signIn = Joi.object({
  email: Joi.string().email().trim().required().min(1),
  password: Joi.string().trim().required().min(6),
})

export { signIn, signUp }
