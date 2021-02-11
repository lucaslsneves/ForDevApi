import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../app'
import env from '../config/env'

let surveyCollection:Collection
let accountCollection:Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('POST /surveys', () => {
    it('Should return 403 if accessToken is not provided', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'question',
          answers: [{
            image: 'http://image-name.com',
            answer: 'any_answer'
          },
          {
            answer: 'any_answer'
          }
          ]
        })
        .expect(403)
    })

    it('Should return 204 if a valid accessToken is provided', async () => {
      const res = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        role: 'admin'
      })
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.jwtSecret)
      await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'question',
          answers: [{
            image: 'http://image-name.com',
            answer: 'any_answer'
          },
          {
            answer: 'any_answer'
          }
          ]
        })
        .expect(204)
    })
  })
})
