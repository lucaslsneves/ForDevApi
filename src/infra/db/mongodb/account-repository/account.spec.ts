import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should return an account on success', async () => {
    const sut = new AccountMongoRepository()
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
