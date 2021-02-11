import { AccountEntity } from '../../../../domain/entities/account-entity'

export interface LoadAccountByTokenRepository {
  loadByToken(accessToken: string): Promise<AccountEntity>
}
