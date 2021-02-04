import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'
describe('RequiredField Validation', () => {
  it('Should return an InvalidParamError if validation fails', () => {
    const sut = new CompareFieldsValidation('any_field', 'other_field')
    const error = sut.validate({ any_field: 'any_field', other_field: 'other_field' })
    expect(error).toEqual(new InvalidParamError('other_field'))
  })

  it('Should return null on success', () => {
    const sut = new CompareFieldsValidation('any_field', 'other_field')
    const error = sut.validate({ any_field: 'any_field', other_field: 'any_field' })
    expect(error).toEqual(null)
  })
})
