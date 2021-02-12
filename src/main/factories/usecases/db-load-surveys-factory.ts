import { DbLoadSurveys } from '../../../data/usecases/load-surveys/db-load-surveys'
import { SurveyMongoRepository } from '../../../infra/db/mongodb/survey-repository/surver-mongo-repository'

export const makeDbLoadSurveys = (): DbLoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}
