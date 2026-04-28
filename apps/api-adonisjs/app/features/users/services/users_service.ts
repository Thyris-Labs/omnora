import SaveAvatarImageAction, {
  type SaveAvatarError,
} from '#features/environments/actions/save_avatar_image'
import Environment from '#features/environments/models/environment'
import User from '#features/users/models/user'
import { inject } from '@adonisjs/core'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import { err, isErr, ok, type Result } from '#shared/errors'

type UpdateUserError = 'ERR_USERNAME_ALREADY_EXIST'
type UpdateAvatarError = SaveAvatarError

@inject()
export default class UsersService {
  constructor(private readonly saveAvatarImage: SaveAvatarImageAction) { }

  async setup(caller: User): Promise<{ user: User; environments: Environment[] }> {
    const environments = await Environment.query().where('ownerId', caller.id)
    return ok({ user: caller, environments })
  }

  async updateUser({
    caller,
    displayName,
    username,
  }: {
    caller: User
    displayName: string
    username: string
  }): Promise<Result<User, UpdateUserError>> {
    const existingUser = await User.findBy('username', username)
    if (existingUser && existingUser.id !== caller.id) {
      return err('ERR_USERNAME_ALREADY_EXIST', 'This username is already in use.')
    }

    caller.merge({ displayName, username })
    await caller.save()

    return ok(caller)
  }

  async updateAvatar({
    caller,
    avatar,
  }: {
    caller: User
    avatar: MultipartFile
  }): Promise<Result<{ user: User; avatarUrl: string }, UpdateAvatarError>> {
    const avatarUrl = await this.saveAvatarImage.execute(avatar)
    if (isErr(avatarUrl)) return avatarUrl

    caller.merge({ avatar: avatarUrl })
    await caller.save()

    return ok({ user: caller, avatarUrl })
  }
}
