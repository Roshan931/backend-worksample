import express, { Express } from 'express'
import cors from 'cors'

import userRouter from './user/user.router'
import { handleInvalidJsonBody } from './utils'

export const createServer = () => {
  const app: Express = express()

  app.use(cors())
  app.options('*', cors())

  app.use(express.json())

  app.use(handleInvalidJsonBody)
  app.use('/users', userRouter)

  return app
}
