import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols'
import { AddAccount, AddAccountModel, Hasher, AccountEntity, AddAccountRepository } from './db-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository : AddAccountRepository,
    private readonly loadAccountByEmailRepository : LoadAccountByEmailRepository
  ) {}

  async add (addAccountModel: AddAccountModel): Promise<AccountEntity> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(addAccountModel.email)
    if (account) {
      return null
    }
    const hashedPassword = await this.hasher.hash(addAccountModel.password)
    const accountEntity = await this.addAccountRepository.add({
      ...addAccountModel,
      password: hashedPassword
    })
    return accountEntity
  }
}
