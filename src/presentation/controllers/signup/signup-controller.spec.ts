import { SignUpController } from './signup-controller'
import { AddAccount, AddAccountModel, AccountEntity, Validation } from './sign-up-controller-protocols'
import { MissingParamError, ServerError } from '../../errors'
import { HttpRequest } from '../../protocols'
import { ok, serverError, badRequest } from '../../helpers/http-helpers'

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}
const makeFakeAccountEntity = (): AccountEntity => ({
  id: 'any_id',
  email: 'any_email@gmail.com',
  name: 'any_name',
  password: 'any_password'
})
const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@gmail.com',
    name: 'any_name',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountEntity> {
      const fakeAccount: AccountEntity = makeFakeAccountEntity()
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

interface SutTypes {
  sut: SignUpController,
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(addAccountStub, validationStub)

  return {
    sut,
    addAccountStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    sut.handle(makeHttpRequest())
    expect(addSpy).toHaveBeenCalledWith({
      email: 'any_email@gmail.com',
      name: 'any_name',
      password: 'any_password'
    })
  })

  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  it('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccountEntity()))
  })

  it('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const valitadeSpy = jest.spyOn(validationStub, 'validate')
    sut.handle(makeHttpRequest())
    expect(valitadeSpy).toHaveBeenCalledWith(makeHttpRequest().body)
  })

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
