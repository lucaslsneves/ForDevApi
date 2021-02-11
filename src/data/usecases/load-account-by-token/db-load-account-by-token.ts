import { AccountEntity } from '../add-account/db-account-protocols'
import { Decrypter, LoadAccountByToken, LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter : Decrypter,
    private readonly loadAccountByTokenRepository : LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountEntity> {
    await this.decrypter.decrypt(accessToken)
    return null
  }
}
