import { LoadSurveysRepository } from '../../protocols/db/survey-repository/load-surveys-repository'
import { LoadSurveys, SurveyEntity } from './db-load-surveys-protocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor (
    private readonly loadSurveysRepository: LoadSurveysRepository
  ) {}

  async load (): Promise<SurveyEntity[]> {
    await this.loadSurveysRepository.loadAll()
    return null
  }
}
