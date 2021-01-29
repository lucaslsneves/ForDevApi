import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helpers'
import { HttpRequest } from '../../protocols'
import { EmailValidator } from '../../protocols/email-validator'
import { LoginController } from './login'

const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@gmail.com',
    password: 'any_password'
  }
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('Login Controller', () => {
  it('Should return 400 if email is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should return 400 if password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('Should call EmailValidator with correct value', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeHttpRequest())
    expect(isValidSpy).toHaveBeenCalledWith(makeHttpRequest().body.email)
  })

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
