import { AccountEntity } from '../../domain/entities/account-entity'

export interface LoadAccountByEmailRepository {
  load(email: string): Promise<AccountEntity>
}
