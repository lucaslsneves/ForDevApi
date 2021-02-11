import { AccountEntity } from '../../../../domain/entities/account-entity'

export interface LoadAccountByTokenRepository {
  loadByToken(token: string, role?:string): Promise<AccountEntity>
}
