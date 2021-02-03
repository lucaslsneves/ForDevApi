import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../app'

let accountCollection:Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('POST /signup', () => {
    it('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Lucas',
          email: 'lucas@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    it('Should return 200 on login', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Lucas',
        email: 'lucas@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'lucas@gmail.com',
          password: '123'
        })
        .expect(200)
    })

    it('Should return 401 if email is invalid', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Lucas',
        email: 'valid@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'invalid@gmail.com',
          password: '123'
        })
        .expect(401)
    })

    it('Should return 401 if password is invalid', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Lucas',
        email: 'valid@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'valid@gmail.com',
          password: 'invalid_password'
        })
        .expect(401)
    })

    it('Should return 400 if email is not provided', async () => {
      await request(app)
        .post('/api/login')
        .send({
          password: 'any_password'
        })
        .expect(400)
    })

    it('Should return 400 if password is not provided', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@gmail.com'

        })
        .expect(400)
    })
  })
})
