import type User from '#features/users/models/user'
import Directory from '../models/directory.ts'
import type { CreateDirectoryPayload } from '../validators/directory_validator.ts'

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
}
