import type User from '#features/users/models/user'
import Directory from '../models/directory.ts'
import type {
  CreateDirectoryPayload,
  MoveDirectoryPayload,
} from '../validators/directory_validator.ts'

export default class DirectoriesService {
  async createDirectory({
    caller,
    directory,
  }: {
    caller: User
    directory: CreateDirectoryPayload
  }) {
    return Directory.create({
      id: crypto.randomUUID(),
      ownerId: caller.id,
      title: directory.title,
      positionIdx: directory.positionIdx,
      moduleType: directory.type,
    })
  }

  async editDirectory({
    caller,
    directoryId,
    title,
  }: {
    caller: User
    directoryId: string
    title: string
  }) {
    const existingDirectory = await Directory.query()
      .where('id', directoryId)
      .where('owner_id', caller.id)
      .firstOrFail()

    existingDirectory.merge({ title })
    await existingDirectory.save()
  }

  async moveDirectory({
    caller,
    directory,
  }: {
    caller: User
    directory: MoveDirectoryPayload
  }) {
    const existingDirectory = await Directory.query()
      .where('id', directory.directoryId)
      .where('owner_id', caller.id)
      .firstOrFail()

    existingDirectory.merge({ positionIdx: directory.positionIdx })
    await existingDirectory.save()
  }
}
