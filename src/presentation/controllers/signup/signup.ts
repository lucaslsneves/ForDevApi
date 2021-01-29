import { HttpRequest, HttpResponse, Controller, AddAccount, Validation } from './sign-up-protocols'

import { badRequest, ok, serverError } from '../../helpers/http-helpers'

export class SignUpController implements Controller {
  private readonly validator: Validation

  private readonly addAccount: AddAccount
  constructor (addAccount: AddAccount, validator: Validation) {
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
