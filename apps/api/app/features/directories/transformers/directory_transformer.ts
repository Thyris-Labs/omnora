import type Directory from '#features/directories/models/directory'
import NoteTransformer from '#features/notes/transformers/note_transformer'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class DirectoryTransformer extends BaseTransformer<Directory> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'title',
      'moduleType',
      'positionIdx',
      'createdAt',
      'updatedAt',
    ])
  }

  withNotes() {
    return {
      ...this.toObject(),
      notes: NoteTransformer.transform(this.resource.notes),
    }
  }
}
