import { HttpContext } from '@adonisjs/core/http'
import { createEnvironmentValidator } from '../validators/environment_validator.ts'
import EnvironmentsService from '../services/environments_service.ts'
import { inject } from '@adonisjs/core'
import { match } from '#shared/errors'
import EnvironmentTransformer from '../transformers/environmnent_transformer.ts'

@inject()
export default class EnvironmentsController {
  constructor(protected readonly environmentsService: EnvironmentsService) {}

  async store({ request, caller, response, serialize }: HttpContext) {
    const { name, avatar } = await request.validateUsing(createEnvironmentValidator)
    const res = await this.environmentsService.createEnvironment({ caller, name, avatar })

    return match(res, {
      ERR_SAVE_AVATAR_FAILED: (e) => response.internalServerError(e),
      ERR_INVALID_EXTENSION: (e) => response.badRequest(e),
      ok: (v) => serialize({ environment: EnvironmentTransformer.transform(v) }),
    })
  }
}
