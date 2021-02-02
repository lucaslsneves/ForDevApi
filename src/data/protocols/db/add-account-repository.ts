import { AccountEntity } from '../../domain/entities/account-entity'
import { AddAccountModel } from '../../domain/usecases/add-account'

export interface AddAccountRepository {
  add (account: AddAccountModel): Promise<AccountEntity>
}
