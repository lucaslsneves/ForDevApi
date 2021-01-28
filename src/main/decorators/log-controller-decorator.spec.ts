import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse:HttpResponse = {
        statusCode: 200,
        body: httpRequest.body
      }
      return new Promise(resolve => resolve(httpResponse))
    }
  }
  return new ControllerStub()
}
interface SutTypes {
  sut: LogControllerDecorator,
  controllerStub: Controller
}
const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)
  return {
    sut,
    controllerStub
  }
}

describe('LogControllerDecorator', () => {
  it('should call controller handle method ', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest : HttpRequest = {
      body: {
        email: 'any@email.com,',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
