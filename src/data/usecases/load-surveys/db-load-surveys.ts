import { LoadSurveys, SurveyEntity, LoadSurveysRepository } from './db-load-surveys-protocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor (
    private readonly loadSurveysRepository: LoadSurveysRepository
  ) {}

  async load (): Promise<SurveyEntity[]> {
    const surveys = await this.loadSurveysRepository.loadAll()
    return surveys
  }
}
