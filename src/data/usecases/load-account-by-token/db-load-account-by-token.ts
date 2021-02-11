import { AccountEntity } from '../add-account/db-account-protocols'
import { Decrypter, LoadAccountByToken, LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter : Decrypter,
    private readonly loadAccountByTokenRepository : LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountEntity> {
    const token = await this.decrypter.decrypt(accessToken)
    if (token) {
      await this.loadAccountByTokenRepository.loadByToken(token, role)
    }
    await this.loadAccountByTokenRepository.loadByToken(token, role)
    return null
  }
}
