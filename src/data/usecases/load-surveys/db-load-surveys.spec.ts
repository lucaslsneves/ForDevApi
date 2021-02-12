import { DbLoadSurveys } from './db-load-surveys'
import { SurveyEntity, LoadSurveysRepository } from './db-load-surveys-protocols'

const makeSurveyEntities = (): SurveyEntity[] => [
  {
    id: 'any_id',
    question: 'any_question',
    answers: [{
      image: 'any_image',
      anwser: 'any_answer'
    }],
    date: new Date()
  },
  {
    id: 'other_id',
    question: 'other_question',
    answers: [{
      image: 'other_image',
      anwser: 'other_answer'
    }],
    date: new Date()
  }
]
const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyEntity[]> {
      return makeSurveyEntities()
    }
  }
  return new LoadSurveysRepositoryStub()
}

interface SutTypes {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub:LoadSurveysRepository
}
const makeSut = ():SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return {
    sut,
    loadSurveysRepositoryStub
  }
}

describe('DbLoadSurveys Usecase', () => {
  it('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadAll = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAll).toHaveBeenCalled()
  })
})
