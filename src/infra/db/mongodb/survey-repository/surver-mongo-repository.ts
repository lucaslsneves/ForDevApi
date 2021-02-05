import { AddSurveyParams, AddSurveyRepository } from '../../../../data/usecases/add-survey/db-add-survey-protocols'
import { MongoHelper } from '../helpers/mongo-helper'
export class SurveyMongoRepository implements AddSurveyRepository {
  async add (survey: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(survey)
  }
}
