import type User from '#features/users/models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'email',
      'username',
      'displayName',
      'avatar',
      'createdAt',
      'updatedAt',
    ])
  }
}
