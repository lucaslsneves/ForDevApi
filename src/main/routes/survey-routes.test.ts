import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../app'

let surveyCollection:Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
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
  })
})
