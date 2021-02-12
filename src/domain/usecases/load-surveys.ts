import { SurveyEntity } from '../entities/survey-entity'

export interface LoadSurveys {
  load(): Promise<SurveyEntity[]>
}
