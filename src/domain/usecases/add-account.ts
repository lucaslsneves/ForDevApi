import { AccountEntity } from '../entities/account-entity'

export interface AddAccountModel {
  name: string,
  email: string,
  password: string
}

export interface AddAccount {
  add (account: AddAccountModel): Promise<AccountEntity>
}
