import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { AccountEntity } from '../../domain/entities/account-entity'
import { ok, serverError } from '../../presentation/helpers/http-helpers'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}
const makeFakeAccountEntity = (): AccountEntity => ({
  id: 'any_id',
  email: 'any_email@gmail.com',
  name: 'any_name',
  password: 'any_password'
})
const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}
const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(ok(makeFakeAccountEntity())))
    }
  }
  return new ControllerStub()
}
const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@gmail.com',
    name: 'any_name',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})
interface SutTypes {
  sut: LogControllerDecorator,
  controllerStub: Controller,
  logErrorRepositoryStub: LogErrorRepository
}
const makeSut = (): SutTypes => {
  const logErrorRepositoryStub = makeLogErrorRepository()
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogControllerDecorator', () => {
  it('should call controller handle method ', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    sut.handle(makeHttpRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeHttpRequest())
  })

  it('should return the same result of controller handle method ', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccountEntity()))
  })

  it('should call LogErrorRepository witch correct error if Controller  returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise(resolve => resolve(makeFakeServerError())))
    await sut.handle(makeHttpRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
