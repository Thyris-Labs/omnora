import type Note from '#features/notes/models/note'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class NoteTransformer extends BaseTransformer<Note> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'title',
      'cover',
      'content',
      'rawContent',
      'directoryId',
      'positionIdx',
      'createdAt',
      'updatedAt',
    ])
  }
}
