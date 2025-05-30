import { Router, Request, Response } from 'express'
import Joi from 'joi'
import joiValidation from 'express-joi-validation'
import { createUser, getUsers } from './user.service'
import { CreateUserDto, GetUsersDto } from './user.dto'
import { MAX_EMAIL_LENGTH, MAX_NAME_LENGTH, MIN_NAME_LENGTH } from './user.entity'
import { RESTError } from '../utils'

const validator = joiValidation.createValidator({
  joi: {
    abortEarly: true,
  },
})

const router = Router()

type CreateUserRequest = Request<unknown, unknown, CreateUserDto>

const createUserSchema = Joi.object<CreateUserDto>({
  name: Joi.string().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH).required(),
  email: Joi.string().email().max(MAX_EMAIL_LENGTH).required(),
})

async function createUserHandler(req: CreateUserRequest, res: Response): Promise<void> {
  try {
    const { name, email } = req.body

    await createUser(name, email)

    res.status(201).end('User has been created successfully')
  } catch (error) {
    console.error('Creating a user failed', error)

    if (error instanceof RESTError) {
      res.status(error.status).end(error.message)
    } else {
      res.status(500).end('Something went wrong creating a user, please try again.')
    }
  }
}

router.post('/', validator.body(createUserSchema), createUserHandler)

type GetUsersRequest = Request<unknown, unknown, unknown, GetUsersDto>

const getUsersSchema = Joi.object<GetUsersDto>({
  created: Joi.string().valid('asc', 'desc', 'ASC', 'DESC').optional(),
  limit: Joi.number().min(1).optional(),
  offset: Joi.number().min(0).optional(),
})

async function getUsersHandler(req: GetUsersRequest, res: Response): Promise<void> {
  try {
    const { created, limit, offset } = req.query

    const users = await getUsers(created, limit, offset)

    res.status(200).json(users)
  } catch (error) {
    console.error('Fetching users failed', error)

    res.status(500).end('Something went wrong while fetching the users, please try again.')
  }
}

router.get('/', validator.query(getUsersSchema), getUsersHandler)

export default router
