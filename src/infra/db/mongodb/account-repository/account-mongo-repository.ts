import { AddAccountRepository } from '../../../../data/protocols/db/account-repository/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account-repository/load-account-by-email-repository'
import { LoadAccountByTokenRepository } from '../../../../data/protocols/db/account-repository/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account-repository/update-access-token-repository'

import { AccountEntity } from '../../../../domain/entities/account-entity'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
export class AccountMongoRepository implements
AddAccountRepository,
LoadAccountByEmailRepository,
UpdateAccessTokenRepository,
LoadAccountByTokenRepository {
  async add (addAccountModel: AddAccountModel): Promise<AccountEntity> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(addAccountModel)
    const account = result.ops[0]
    return MongoHelper.map(account)
  }

  async loadByEmail (email: string): Promise<AccountEntity> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    accountCollection.updateOne({ _id: id }, {
      $set: {
        accessToken: token
      }
    })
  }

  async loadByToken (token: string, role?: string): Promise<AccountEntity> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ accessToken: token, $or: [{ role }, { role: 'admin' }] })
    return account && MongoHelper.map(account)
  }
}
