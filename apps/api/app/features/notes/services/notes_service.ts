import Directory from '#features/directories/models/directory'
import type User from '#features/users/models/user'
import type { MoveNotePayload, SaveNotePayload } from '../validators/note_validator.ts'
import Note from '../models/note.ts'

export default class NotesService {
  async listNotes(caller: User) {
    const directories = await Directory.query()
      .where('owner_id', caller.id)
      .where((query) => {
        query.where('is_deleted', false)
      })
      .orderBy('position_idx', 'asc')
      .preload('notes', (query) => {
        query
          .where('owner_id', caller.id)
          .where((notesQuery) => {
            notesQuery.where('is_deleted', false)
          })
          .orderBy('position_idx', 'asc')
      })

    return {
      directories,
      notes: await Note.query()
        .where('owner_id', caller.id)
        .where((query) => {
          query.where('is_deleted', false)
        })
        .whereNull('directory_id')
        .orderBy('position_idx', 'asc'),
    }
  }

  async listTrash(caller: User) {
    const [directories, notes] = await Promise.all([
      Directory.query()
        .where('owner_id', caller.id)
        .where('is_deleted', true)
        .orderBy('updated_at', 'desc'),
      Note.query()
        .where('owner_id', caller.id)
        .where('is_deleted', true)
        .orderBy('updated_at', 'desc'),
    ])

    return { directories, notes }
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

  async softDeleteNote({ caller, noteId }: { caller: User; noteId: string }) {
    const existingNote = await Note.query()
      .where('id', noteId)
      .where('owner_id', caller.id)
      .firstOrFail()

    existingNote.merge({ isDeleted: true })
    await existingNote.save()
  }

  async recoverNote({ caller, noteId }: { caller: User; noteId: string }) {
    const existingNote = await Note.query()
      .where('id', noteId)
      .where('owner_id', caller.id)
      .firstOrFail()

    existingNote.merge({ isDeleted: false })
    await existingNote.save()
  }

  async deleteNote({ caller, noteId }: { caller: User; noteId: string }) {
    const existingNote = await Note.query()
      .where('id', noteId)
      .where('owner_id', caller.id)
      .firstOrFail()

    await existingNote.delete()
  }
}
