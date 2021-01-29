import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

class ValidationStub implements Validation {
  validate (input: any): Error {
    return null
  }
}

describe('ValidationComposite', () => {
  it('Should return the same Validations error', () => {
    const validationStub = new ValidationStub()
    const sut = new ValidationComposite([
      validationStub
    ])
    jest.spyOn(validationStub, 'validate').mockReturnValue(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  it('Should return null if validation success', () => {
    const validationStub = new ValidationStub()
    const sut = new ValidationComposite([
      validationStub
    ])
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(null)
  })
})
