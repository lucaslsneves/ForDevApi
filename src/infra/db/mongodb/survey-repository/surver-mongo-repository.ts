import { AddSurveyParams, AddSurveyRepository } from '../../../../data/usecases/add-survey/db-add-survey-protocols'
import { LoadSurveysRepository, SurveyEntity } from '../../../../data/usecases/load-surveys/db-load-surveys-protocols'
import { MongoHelper } from '../helpers/mongo-helper'
export class SurveyMongoRepository implements
AddSurveyRepository,
LoadSurveysRepository {
  async add (survey: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(survey)
  }

  async loadAll (): Promise<SurveyEntity[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys:SurveyEntity[] = await surveyCollection.find().toArray()
    return surveys
  }
}
