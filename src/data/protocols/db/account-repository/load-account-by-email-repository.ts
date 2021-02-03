import { AccountEntity } from '../../../../domain/entities/account-entity'

export interface LoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<AccountEntity>
}
