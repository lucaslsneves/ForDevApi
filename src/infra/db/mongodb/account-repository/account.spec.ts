import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = (): AccountMongoRepository => new AccountMongoRepository()

  it('Should return an account on success', async () => {
    const sut = makeSut()
    const accountEntity = await sut.add({
      email: 'any_email',
      name: 'any_name',
      password: 'any_password'
    })

    expect(accountEntity).toBeTruthy()
    expect(accountEntity.id).toBeTruthy()
    expect(accountEntity.name).toBe('any_name')
    expect(accountEntity.email).toBe('any_email')
    expect(accountEntity.password).toBe('any_password')
  })
})
