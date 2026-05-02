import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import DirectoriesService from '../services/directories_service.ts'
import DirectoryTransformer from '../transformers/directory_transformer.ts'
import {
  createDirectoryValidator,
  directoryIdValidator,
  editDirectoryValidator,
  moveDirectoryValidator,
} from '../validators/directory_validator.ts'

@inject()
export default class DirectoriesController {
  constructor(protected readonly directoriesService: DirectoriesService) {}

  async store({ request, caller, serialize }: HttpContext) {
    const directory = await request.validateUsing(createDirectoryValidator)
    const createdDirectory = await this.directoriesService.createDirectory({ caller, directory })

    return serialize({ directory: DirectoryTransformer.transform(createdDirectory) })
  }

  async update({ request, caller, response }: HttpContext) {
    const { title, directoryId } = await request.validateUsing(editDirectoryValidator)
    await this.directoriesService.editDirectory({ caller, directoryId, title })

    return response.noContent()
  }

  async move({ request, caller, response }: HttpContext) {
    const directory = await request.validateUsing(moveDirectoryValidator)

    await this.directoriesService.moveDirectory({ caller, directory })

    return response.noContent()
  }

  async softDelete({ request, caller, response }: HttpContext) {
    const { directoryId } = await request.validateUsing(directoryIdValidator)

    await this.directoriesService.softDeleteDirectory({ caller, directoryId })

    return response.noContent()
  }

  async recover({ request, caller, response }: HttpContext) {
    const { directoryId } = await request.validateUsing(directoryIdValidator)

    await this.directoriesService.recoverDirectory({ caller, directoryId })

    return response.noContent()
  }

  async destroy({ request, caller, response }: HttpContext) {
    const { directoryId } = await request.validateUsing(directoryIdValidator)

    await this.directoriesService.deleteDirectory({ caller, directoryId })

    return response.noContent()
  }
}
