import { User } from '@prisma/client'

//= =================== user ==================

type UsersBasic = Pick<User, 'id' | 'name'>

interface ResponseAllUsers {
  users: UsersBasic[]
}

//= ================ update ====================

interface UpdateUserData {
  name?: string
  email?: string
  phone?: string
  cpf?: string
  isAdministrator?: boolean
  password?: string
}

export { ResponseAllUsers, UpdateUserData, UsersBasic }
