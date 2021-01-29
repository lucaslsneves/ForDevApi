import { HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount, Validation } from './sign-up-protocols'
import { InvalidParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helpers'

export class SignUpController implements Controller {
  private readonly validator: Validation
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  constructor (emailValidator: EmailValidator, addAccount: AddAccount, validator: Validation) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validator = validator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { password, email, name } = httpRequest.body

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        email,
        name,
        password
      })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
