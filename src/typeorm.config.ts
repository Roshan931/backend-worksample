import * as dotenv from 'dotenv'
import { join } from 'path'
import { DataSource, DataSourceOptions } from 'typeorm'
import { User } from './user/user.entity'

dotenv.config()

export const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  synchronize: false,
  migrations: [join(__dirname, 'migrations', '**', '*.{ts,js}')],
}

export default new DataSource(config)
