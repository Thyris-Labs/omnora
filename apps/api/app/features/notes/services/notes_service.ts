import Directory from '#features/directories/models/directory'
import type User from '#features/users/models/user'
import type { MoveNotePayload, SaveNotePayload } from '../validators/note_validator.ts'
import Note from '../models/note.ts'

export default class NotesService {
  async listNotes(caller: User) {
    const directories = await Directory.query()
      .where('owner_id', caller.id)
      .orderBy('position_idx', 'asc')
      .preload('notes', (query) => {
        query.where('owner_id', caller.id).orderBy('position_idx', 'asc')
      })

    return {
      directories,
      notes: await Note.query()
        .where('owner_id', caller.id)
        .whereNull('directory_id')
        .orderBy('position_idx', 'asc'),
    }
  }

  async saveNote({ caller, note }: { caller: User; note: SaveNotePayload }) {
    const existingNote = await Note.query()
      .where('id', note.id)
      .where('owner_id', caller.id)
      .first()

    if (!existingNote) {
      await this.#createNote(caller, note)
      return
    }

    existingNote.merge(note)
    await existingNote.save()
  }

  async #createNote(caller: User, note: SaveNotePayload) {
    await Note.create({
      ownerId: caller.id,
      ...note,
    })
  }

  async moveNote({ caller, note }: { caller: User; note: MoveNotePayload }) {
    const existingNote = await Note.query()
      .where('id', note.noteId)
      .where('owner_id', caller.id)
      .firstOrFail()

    existingNote.merge({
      directoryId: note.directoryId,
      positionIdx: note.positionIdx,
    })
    await existingNote.save()
  }
}
