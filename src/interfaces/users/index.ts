import { User } from '@prisma/client'

//= =================== user ==================

//= ================ update ====================

interface IUserBasic {
  id: number
  name: string
  email: string
  createdAt: Date
}

type resultGetUsers = IUserBasic[] | Omit<User, 'password'>

interface UpdateUserData {
  name?: string
  email?: string
  phone?: string
  cpf?: string
  isAdministrator?: boolean
  password?: string
}

export { UpdateUserData, resultGetUsers, IUserBasic }
