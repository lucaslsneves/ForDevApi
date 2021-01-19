import { AddAccount, AddAccountModel, Encrypter, AccountEntity, AddAccountRepository } from './db-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository : AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (addAccountModel: AddAccountModel): Promise<AccountEntity> {
    const hashedPassword = await this.encrypter.encrypt(addAccountModel.password)
    const accountEntity = await this.addAccountRepository.add({
      ...addAccountModel,
      password: hashedPassword
    })
    return accountEntity
  }
}
