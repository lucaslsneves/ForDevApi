import { AccountEntity, AddAccountModel } from '../../../usecases/add-account/db-account-protocols'

export interface AddAccountRepository {
  add (account: AddAccountModel): Promise<AccountEntity>
}
