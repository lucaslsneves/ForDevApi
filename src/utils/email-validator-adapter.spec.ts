import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidatorAdapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email@email.com')
    expect(isValid).toBe(false)
  })
})
