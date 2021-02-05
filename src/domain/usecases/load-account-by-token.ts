import { AccountEntity } from '../entities/account-entity'

export interface LoadAccountByToken {
  load (accessToken: string, role?:string): Promise<AccountEntity>
}
