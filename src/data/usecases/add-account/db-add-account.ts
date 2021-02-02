import { AddAccount, AddAccountModel, Hasher, AccountEntity, AddAccountRepository } from './db-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly hasher: Hasher
  private readonly addAccountRepository: AddAccountRepository

  constructor (hasher: Hasher, addAccountRepository : AddAccountRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
  }

  async add (addAccountModel: AddAccountModel): Promise<AccountEntity> {
    const hashedPassword = await this.hasher.hash(addAccountModel.password)
    const accountEntity = await this.addAccountRepository.add({
      ...addAccountModel,
      password: hashedPassword
    })
    return accountEntity
  }
}
