import app, { init } from '@/app'
import faker from '@faker-js/faker'
import supertest from 'supertest'
import { createUser } from '../factories'
import { cleanDb } from '../helpers'

beforeAll(async () => {
  await init()
  await cleanDb()
})

const server = supertest(app)

describe('POST /auth/sign-in', () => {
  it('should respond with status 400 when body is not given', async () => {
    const response = await server.post('/auth/sign-in')

    expect(response.status).toBe(400)
  })

  it('should respond with status 400 when body is not valid', async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() }

    const response = await server.post('/auth/sign-in').send(invalidBody)

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
  })

  describe('when body is valid', () => {
    const generateValidBody = () => ({
      email: faker.internet.email(),
      password: faker.internet.password(6)
    })

    it('should respond with status 403 if there is no user for given email', async () => {
      const body = generateValidBody()

      const response = await server.post('/auth/sign-in').send(body)

      expect(response.status).toBe(httpStatus.FORBIDDEN)
    })

    it('should respond with status 403 if there is a user for given email but password is not correct', async () => {
      const body = generateValidBody()
      const { id } = await createtypeOfUser()
      await createUser({
        ...body,
        typeOfUserId: id
      })

      const response = await server.post('/auth/sign-in').send({
        ...body,
        password: faker.lorem.word(6)
      })

      expect(response.status).toBe(httpStatus.FORBIDDEN)
    })

    describe('when credentials are valid', () => {
      it('should respond with status 200', async () => {
        const body = generateValidBody()
        const { id } = await createtypeOfUser()
        await createUser({
          ...body,
          typeOfUserId: id
        })

        const response = await server.post('/auth/sign-in').send(body)

        expect(response.status).toBe(httpStatus.OK)
      })

      it('should respond with user data', async () => {
        const body = generateValidBody()
        const { id } = await createtypeOfUser()
        const user = await createUser({
          ...body,
          typeOfUserId: id
        })

        const response = await server.post('/auth/sign-in').send(body)

        expect(response.body.user).toEqual({
          id: user.id,
          name: user.name
        })
      })

      it('should respond with session token', async () => {
        const body = generateValidBody()
        const { id } = await createtypeOfUser()
        await createUser({
          ...body,
          typeOfUserId: id
        })
        const response = await server.post('/auth/sign-in').send(body)

        expect(response.body.token).toBeDefined()
      })
    })
  })
})
