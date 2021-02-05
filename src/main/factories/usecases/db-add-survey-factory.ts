import { DbAddSurvey } from '../../../data/usecases/add-survey/db-add-survey'
import { SurveyMongoRepository } from '../../../infra/db/mongodb/survey-repository/surver-mongo-repository'

export const makeDbAddSurvey = (): DbAddSurvey => {
  return new DbAddSurvey(new SurveyMongoRepository())
}
