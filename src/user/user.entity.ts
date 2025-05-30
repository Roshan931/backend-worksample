import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

export const MIN_NAME_LENGTH = 3
export const MAX_NAME_LENGTH = 100
export const MAX_EMAIL_LENGTH = 254

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: MAX_NAME_LENGTH })
  name: string

  @Column({ length: MAX_EMAIL_LENGTH, unique: true })
  email: string

  @CreateDateColumn()
  createdAt: Date
}
