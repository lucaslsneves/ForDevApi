import { Decrypter, LoadAccountByToken, LoadAccountByTokenRepository, AccountEntity } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter : Decrypter,
    private readonly loadAccountByTokenRepository : LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountEntity> {
    let token:string
    try {
      token = await this.decrypter.decrypt(accessToken)
    } catch (e) {
      return null
    }

    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
      if (account) {
        return account
      }
    }
    return null
  }
}
