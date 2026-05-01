import Note from '#features/notes/models/note'
import { DirectorySchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Directory extends DirectorySchema {
  @hasMany(() => Note)
  declare notes: HasMany<typeof Note>
}
