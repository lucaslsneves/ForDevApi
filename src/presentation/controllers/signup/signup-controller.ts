import { HttpRequest, HttpResponse, Controller, AddAccount, Validation, Authentication } from './sign-up-controller-protocols'

import { badRequest, ok, serverError } from '../../helpers/http-helpers'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { password, email, name } = httpRequest.body
      await this.addAccount.add({
        email,
        name,
        password
      })

      const accessToken = await this.authentication.auth({
        email, password
      })

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
