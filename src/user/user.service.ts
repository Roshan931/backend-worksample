import { FindManyOptions } from 'typeorm'
import TypeormDataSource from '../typeorm.config'
import { RESTError } from '../utils'
import { User } from './user.entity'
import { SortDirection } from './user.dto'

const userRepository = TypeormDataSource.getRepository(User)

export async function createUser(name: string, email: string): Promise<void> {
  const exists = await userRepository.exists({ where: { email } })

  if (exists) {
    throw new RESTError(409, 'A user with that email already exists.')
  }

  await userRepository.insert({
    name,
    email,
  })
}

export async function getUsers(created?: SortDirection, limit?: number, offset?: number): Promise<User[]> {
  const query: FindManyOptions<User> = {}

  if (created) {
    query.order = {
      createdAt: created,
    }
  }

  if (limit) {
    query.take = limit
  }

  if (offset) {
    query.skip = offset
  }

  return await userRepository.find(query)
}
