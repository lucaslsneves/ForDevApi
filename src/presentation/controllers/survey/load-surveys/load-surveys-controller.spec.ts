import MockDate from 'mockdate'
import { LoadSurveys, SurveyEntity } from './load-surveys-protocols'
import { LoadSurveysController } from './load-surveys-controller'
import { ok, serverError } from '../../../helpers/http-helpers'
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

const makeLoadSurveys = ():LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyEntity[]> {
      return makeSurveyEntities()
    }
  }
  return new LoadSurveysStub()
}

interface SutTypes {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}
const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)

  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveys', () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSurveysSpy = jest.spyOn(loadSurveysStub, 'load')
    sut.handle({})
    expect(loadSurveysSpy).toHaveBeenCalled()
  })

  it('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSurveysSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSurveysSpy).toHaveBeenCalled()
  })

  it('Should return 200 on success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(makeSurveyEntities()))
  })

  it('Should return 500 on fails', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
