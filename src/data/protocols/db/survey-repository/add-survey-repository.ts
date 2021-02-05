import { AddSurveyParams } from '../../../usecases/add-survey/db-add-survey-protocols'

export interface AddSurveyRepository {
  add (survey: AddSurveyParams): Promise<void>
}
