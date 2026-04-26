import { HttpContext } from '@adonisjs/core/http'
import {
  signinValidator,
  signupValidator,
  verifyEmailValidator,
} from '#features/users/validators/auth_validator'
import { inject } from '@adonisjs/core'
import AuthService from '../services/auth_service.ts'
import { match } from '#shared/errors'
import UserTransformer from '../transformers/user_transformer.ts'

@inject()
export default class AuthController {
  constructor(protected readonly authService: AuthService) {}

  async verifyEmail({ request, response }: HttpContext) {
    const data = await request.validateUsing(verifyEmailValidator)
    const res = await this.authService.verifyEmail(data)

    return match(res, {
      ERR_USER_ALREADY_EXIST: (e) => response.conflict(e),
      ok: () => response.noContent(),
    })
  }

  async signup({ request, response, serialize, auth }: HttpContext) {
    const data = await request.validateUsing(signupValidator)
    const res = await this.authService.signup(data)

    return match(res, {
      ERR_USER_ALREADY_EXIST: (e) => response.conflict(e),
      ERR_USERNAME_ALREADY_EXIST: (e) => response.conflict(e),
      ERR_INVALID_VERIFICATION_CODE: (e) => response.badRequest(e),
      ok: async ({ user }) => {
        await auth.use('web').login(user, true)

        return serialize({
          user: UserTransformer.transform(user),
        })
      },
    })
  }

  async signin({ request, response, serialize, auth }: HttpContext) {
    const data = await request.validateUsing(signinValidator)
    const res = await this.authService.signin(data)

    return match(res, {
      ERR_INVALID_VERIFICATION_CODE: (e) => response.badRequest(e),
      ERR_USER_NOT_FOUND: (e) => response.notFound(e),
      ok: async ({ user }) => {
        await auth.use('web').login(user, true)

        return serialize({
          user: UserTransformer.transform(user),
        })
      },
    })
  }

  async check({ auth, serialize }: HttpContext) {
    const user = await auth.use('web').authenticate()

    return serialize({
      user: UserTransformer.transform(user),
    })
  }
}
