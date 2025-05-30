import * as dotenv from 'dotenv'
import TypeormDataSource from './typeorm.config'
import { createServer } from './server'

dotenv.config()

const PORT = process.env.PORT || 3111

async function run(): Promise<void> {
  await TypeormDataSource.initialize()

  console.info('Database has been successfully initialised with typeorm.')

  const app = createServer()

  return new Promise((resolve) => {
    app.listen(PORT, resolve)
  })
}

run()
  .then(() => {
    console.info(`Server is initialised and running on localhost: ${PORT}...`)
  })
  .catch((error) => {
    console.error(`Could not start the server correctly.`, error)
    process.exit(1)
  })
