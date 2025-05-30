import request, { Response } from 'supertest'
import TypeormDataSource from '../src/typeorm.config'

const mockFind = jest.fn()
const mockExists = jest.fn()
const mockInsert = jest.fn()

jest.spyOn(TypeormDataSource, 'getRepository').mockImplementation(() => {
  // eslint-disable-next-line
  return {
    find: mockFind,
    exists: mockExists,
    insert: mockInsert,
  } as any
})

import { createServer } from '../src/server'
const app = createServer()

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /users', () => {
    it('should create a user and return 201', async () => {
      mockExists.mockResolvedValue(undefined)
      mockInsert.mockResolvedValue(undefined)

      const res = await request(app).post('/users').send({ name: 'John Doe', email: 'john@example.com' })

      expect(res.status).toBe(201)
      expect(res.text).toBe('User has been created successfully')
      expect(mockExists).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      })
      expect(mockInsert).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
      })
    })

    it('should return 409 if user already exists', async () => {
      mockExists.mockResolvedValue(true)

      const res = await request(app).post('/users').send({ name: 'John Doe', email: 'john@example.com' })

      expect(res.status).toBe(409)
      expect(res.text).toBe('A user with that email already exists.')
    })

    it('should return 500 if database .insert throws an error', async () => {
      mockExists.mockResolvedValue(false)
      mockInsert.mockRejectedValue(new Error('Database crashed'))

      const res = await request(app).post('/users').send({ name: 'Bob', email: 'bob@example.com' })

      expect(res.status).toBe(500)
      expect(res.text).toBe('Something went wrong creating a user, please try again.')
    })
  })

  describe('GET /users', () => {
    it('should return users sorted by createdAt ASC', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'Alice',
          email: 'alice@example.com',
          createdAt: new Date('2025-01-01T10:00:00Z'),
        },
        {
          id: '2',
          name: 'Bob',
          email: 'bob@example.com',
          createdAt: new Date('2025-01-02T10:00:00Z'),
        },
      ]

      mockFind.mockResolvedValue(mockUsers)

      const res = await request(app).get('/users').query({ created: 'asc' })

      expect(res.status).toBe(200)
      expect(mockFind).toHaveBeenCalledWith({
        order: { createdAt: 'asc' },
      })
      expect(res.body).toEqual(
        mockUsers.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
        })),
      )
    })

    it('should support pagination', async () => {
      mockFind.mockResolvedValue([])

      await request(app).get('/users').query({ limit: 9, offset: 3 })

      expect(mockFind).toHaveBeenCalledWith({
        take: 9,
        skip: 3,
      })
    })

    it('should return 500 if database .find throws an error', async () => {
      mockFind.mockRejectedValue(new Error('Database crashed'))

      const res = await request(app).get('/users')

      expect(res.status).toBe(500)
      expect(res.text).toBe('Something went wrong while fetching the users, please try again.')
    })

    it('should return 400 for invalid query', async () => {
      const res = await request(app).get('/users').query({ created: 'random' })
      expect(res.status).toBe(400)
    })

    it.each([
      [{ name: '', email: 'john@example.com' }, '"name" is not allowed to be empty.'],
      [{ name: 'Jo', email: 'john@example.com' }, '"name" length must be at least 3 characters long.'],
      [
        { name: 'J'.repeat(101), email: 'john@example.com' },
        `"name" length must be less than or equal to 100 characters long.`,
      ],
      [{ name: 'John Doe', email: '' }, '"email" is not allowed to be empty.'],
      [{ name: 'John Doe', email: 'not-an-email' }, '"email" must be a valid email.'],
      [{ name: 'John Doe' }, '"email" is required.'],
      [{ email: 'john@example.com' }, '"name" is required.'],
      [{}, '"name" is required.'],
    ])('should return 400 for invalid input: %s (%s)', async (body, expectedMessage) => {
      const res: Response = await request(app).post('/users').send(body)

      expect(res.status).toBe(400)

      if (res.error) {
        expect(res.error.text).toBe(`Error validating request body. ${expectedMessage}`)
      }
    })
  })

  describe('Malformed JSON body', () => {
    it('should return 422 for invalid JSON body', async () => {
      const res = await request(app)
        .post('/users')
        .set('Content-Type', 'application/json')
        .send('{name: "John Doe", email: "john@example.com"')

      expect(res.status).toBe(422)
      expect(res.text).toBe('Invalid JSON: Malformed request body')
    })
  })
})
