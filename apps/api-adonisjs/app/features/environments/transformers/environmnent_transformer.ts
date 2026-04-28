import type Environment from '#features/environments/models/environment'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class EnvironmentTransformer extends BaseTransformer<Environment> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'name',
      'avatar',
      'createdAt',
      'updatedAt',
    ])
  }
}
