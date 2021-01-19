import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountEntity } from '../../../../domain/entities/account-entity'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
export class AccountMongoRepository implements AddAccountRepository {
  async add (addAccountModel: AddAccountModel): Promise<AccountEntity> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(addAccountModel)
    const account = result.ops[0]
    const { _id, ...accountWithNoId } = account

    return {
      id: _id,
      ...accountWithNoId
    }
  }
}
