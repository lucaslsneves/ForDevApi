import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helpers'
import { HttpRequest, HttpResponse, Controller } from '../../protocols'
import { EmailValidator } from '../signup/sign-up-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const { email } = httpRequest.body

    const isValid = this.emailValidator.isValid(email)

    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }
  }
}
