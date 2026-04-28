import EnvironmentTransformer from '#features/environments/transformers/environmnent_transformer'
import { match } from '#shared/errors'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '../transformers/user_transformer.ts'
import UsersService from '../services/users_service.ts'
import { updateAvatarValidator, updateUserValidator } from '../validators/user_validator.ts'

@inject()
export default class UsersController {
  constructor(protected readonly usersService: UsersService) { }

  async setup({ caller, serialize }: HttpContext) {
    const { user, environments } = await this.usersService.setup(caller)

    return serialize.withoutWrapping({
      user: UserTransformer.transform(user),
      environments: EnvironmentTransformer.transform(environments),
    })
  }

  async update({ request, caller, response, serialize }: HttpContext) {
    const data = await request.validateUsing(updateUserValidator)
    const res = await this.usersService.updateUser({ caller, ...data })

    return match(res, {
      ERR_USERNAME_ALREADY_EXIST: (e) => response.badRequest(e),
      ok: (user) => serialize({ user: UserTransformer.transform(user) }),
    })
  }

  async updateAvatar({ request, caller, response, serialize }: HttpContext) {
    const { avatar } = await request.validateUsing(updateAvatarValidator)
    const res = await this.usersService.updateAvatar({ caller, avatar })

    return match(res, {
      ERR_INVALID_EXTENSION: (e) => response.badRequest(e),
      ERR_SAVE_AVATAR_FAILED: (e) => response.internalServerError(e),
      ok: ({ user, avatarUrl }) =>
        serialize.withoutWrapping({
          avatarUrl,
          user: UserTransformer.transform(user),
        }),
    })
  }
}
