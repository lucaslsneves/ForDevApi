import { AccountEntity } from '../../../domain/entities/account-entity'
import { AddAccountModel, Hasher, AddAccountRepository } from './db-account-protocols'
import { DbAddAccount } from './db-add-account'

const makeFakeAddAccountModel = (): AddAccountModel => (
  {
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
  }
)
const makeFakeAccountEntity = (): AccountEntity => ({
  id: 'any_id',
  email: 'any_email@gmail.com',
  name: 'any_name',
  password: 'any_password'
})

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountEntity> {
      return new Promise(resolve => resolve(makeFakeAccountEntity()))
    }
  }
  return new AddAccountRepositoryStub()
}

interface SutTypes {
  sut: DbAddAccount,
  hasherStub: Hasher,
  addAccountRepositoryStub: AddAccountRepository
}
const makeSut = (): SutTypes => {
  const hasherStub = makeHasherStub()
  const addAccountRepositoryStub = makeAddAccountRepositoryStub()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  it('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hasherSpy = jest.spyOn(hasherStub, 'hash')

    await sut.add(makeFakeAddAccountModel())
    expect(hasherSpy).toHaveBeenCalledWith('valid_password')
  })

  it('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.add(makeFakeAddAccountModel())
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeFakeAddAccountModel())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  it('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.add(makeFakeAddAccountModel())
    await expect(promise).rejects.toThrow()
  })

  it('Should return an AccountEntity on success', async () => {
    const { sut } = makeSut()
    const accountEntity = await sut.add(makeFakeAddAccountModel())
    expect(accountEntity).toEqual(makeFakeAccountEntity())
  })
})
