import { InvalidParamError, MissingParamError } from '../../errors'
import { Validation } from '../../protocols/validation'
import { ValidationComposite } from './validation-composite'

class ValidationStub implements Validation {
  validate (input: any): Error {
    return null
  }
}
const makeValidationsStubs = (): Validation[] => [
  new ValidationStub(),
  new ValidationStub()
]
describe('ValidationComposite', () => {
  it('Should return the same Validations error', () => {
    const validationStubs = makeValidationsStubs()
    const sut = new ValidationComposite(validationStubs)
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  it('Should return the first Validations error found it', () => {
    const validationStubs = makeValidationsStubs()
    const sut = new ValidationComposite(validationStubs)
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new InvalidParamError('field'))
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new InvalidParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  it('Should return null if validation success', () => {
    const validationStubs = makeValidationsStubs()
    const sut = new ValidationComposite(validationStubs)
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
