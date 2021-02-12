import { SurveyEntity } from '../../../../domain/entities/survey-entity'

export interface LoadSurveysRepository {
  loadAll(): Promise<SurveyEntity[]>
}
