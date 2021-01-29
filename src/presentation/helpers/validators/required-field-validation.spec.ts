import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredField Validation', () => {
  it('Should return an MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('any_field')
    const error = sut.validate({ invalid_field: 'any_field' })
    expect(error).toEqual(new MissingParamError('any_field'))
  })

  it('Should return null on success', () => {
    const sut = new RequiredFieldValidation('any_field')
    const error = sut.validate({ any_field: 'any_field' })
    expect(error).toEqual(null)
  })
})
