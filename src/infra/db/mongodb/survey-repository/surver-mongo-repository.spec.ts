import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './surver-mongo-repository'

let surveyCollection: Collection
const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository()

describe('Survey Mongo Repository', () => {
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

  describe('Add', () => {
    it('Should add a survey on add method success', async () => {
      const sut = makeSut()
      await sut.add({
        question: 'any_question',
        answers: [{ anwser: 'any_answer', image: 'any_image' }, { anwser: 'other_answer' }],
        date: new Date()
      })
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey.question).toBe('any_question')
    })
  })

  describe('loadAll', () => {
    it('Should load all surveys on loadAll method success', async () => {
      await surveyCollection.insertMany([
        {
          question: 'any_question',
          answers: [{ anwser: 'any_answer', image: 'any_image' }],
          date: new Date()
        },
        {
          question: 'other_question',
          answers: [{ anwser: 'other_answer', image: 'other_image' }],
          date: new Date()
        }
      ])
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
    })

    it('Should load an empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })
})
