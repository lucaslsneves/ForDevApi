import { AuthMiddleware } from './auth-middleware'
import { forbidden } from '../helpers/http-helpers'
import { AccessDeniedError } from '../errors'

const makeSut = ():any => {
  return new AuthMiddleware()
}

describe('Auth Middleware', () => {
  it('Should return 403 if no x-access-token is provided in header', async () => {
    const sut = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
