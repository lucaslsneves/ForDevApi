import { HttpRequest } from '../protocols'
import { AuthMiddleware } from './auth-middleware'
import { forbidden, ok } from '../helpers/http-helpers'
import { AccessDeniedError } from '../errors'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccountEntity } from '../../domain/entities/account-entity'

const makeAccountEntity = ():AccountEntity => ({
  id: 'id',
  email: 'email@email.com',
  name: 'name',
  password: 'password'
})
const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountEntity> {
      return makeAccountEntity()
    }
  }
  return new LoadAccountByTokenStub()
}
const makeHttpRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'token'
  }
})
interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}
const makeSut = ():SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  it('Should return 403 if no x-access-token is provided in header', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(makeHttpRequest())
    expect(loadSpy).toHaveBeenCalledWith('token')
  })

  it('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(null)
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(ok({ accountId: makeAccountEntity().id }))
  })
})
