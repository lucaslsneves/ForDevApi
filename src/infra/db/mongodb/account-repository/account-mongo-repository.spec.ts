import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = (): AccountMongoRepository => new AccountMongoRepository()

  describe('add()', () => {
    it('Should return an account on add success', async () => {
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

  describe('load()', () => {
    it('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        email: 'any_email',
        name: 'any_name',
        password: 'any_password'
      })
      const accountEntity = await sut.loadByEmail('any_email')
      expect(accountEntity).toBeTruthy()
      expect(accountEntity.id).toBeTruthy()
      expect(accountEntity.name).toBe('any_name')
      expect(accountEntity.email).toBe('any_email')
      expect(accountEntity.password).toBe('any_password')
    })

    it('Should return null on loadByEmail fails', async () => {
      const sut = makeSut()
      const accountEntity = await sut.loadByEmail('any_email')
      expect(accountEntity).toBeFalsy()
    })
  })

  describe('updateAccessToken', () => {
    it('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const res = await accountCollection.insertOne({
        email: 'any_email',
        name: 'any_name',
        password: 'any_password'
      })
      const accountWithoutToken = res.ops[0]

      expect(accountWithoutToken).toBeTruthy()
      expect(accountWithoutToken._id).toBeTruthy()
      expect(accountWithoutToken.name).toBe('any_name')
      expect(accountWithoutToken.email).toBe('any_email')
      expect(accountWithoutToken.password).toBe('any_password')

      expect(accountWithoutToken.accessToken).toBeFalsy()

      await sut.updateAccessToken(accountWithoutToken._id, 'any_token')

      const account = await accountCollection.findOne({ _id: accountWithoutToken._id })

      expect(account.accessToken).toBe('any_token')
    })
  })
})
