import { DbLoadSurveys } from './db-load-surveys'
import { SurveyEntity, LoadSurveysRepository } from './db-load-surveys-protocols'
import MockDate from 'mockdate'
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
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadAll = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAll).toHaveBeenCalled()
  })

  it('Should return a surveys list on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(makeSurveyEntities())
  })

  it('Should throws if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const response = sut.load()
    expect(response).rejects.toThrow()
  })
})
