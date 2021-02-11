import { Decrypter, LoadAccountByTokenRepository, AccountEntity } from './db-load-account-by-token-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'

const makeAccountEntity = (): AccountEntity => ({
  id: 'valid_id',
  email: 'valid_email@gmail.com',
  name: 'valid_name',
  password: 'valid_password'
})

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?:string): Promise<AccountEntity> {
      return makeAccountEntity()
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}
const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return 'any_token'
    }
  }
  return new DecrypterStub()
}

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken', () => {
  it('Should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token', 'any_role')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  it('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(null)
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBe(null)
  })

  it('Should call LoadAccountByTokenRepository with correct value', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadAccountSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load('any_token', 'any_role')
    expect(loadAccountSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })
})
