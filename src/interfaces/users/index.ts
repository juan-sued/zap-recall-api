import { User } from '@prisma/client'

//= =================== user ==================

export type UsersBasic = Pick<User, 'id' | 'name' | 'phone'>

export interface ResponseAllUsers {
  users: UsersBasic[]
}

//= ================ update ====================

export interface UpdateUserData {
  name?: string
  email?: string
  phone?: string
  cpf?: string
  isAdministrator?: boolean
  password?: string
}
