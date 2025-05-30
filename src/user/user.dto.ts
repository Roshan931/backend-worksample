import { User } from './user.entity'

export type CreateUserDto = Pick<User, 'name' | 'email'>

export type SortDirection = 'asc' | 'desc' | 'ASC' | 'DESC'
export interface GetUsersDto extends Record<string, any> {
  created?: SortDirection
  limit?: number
  offset?: number
}
