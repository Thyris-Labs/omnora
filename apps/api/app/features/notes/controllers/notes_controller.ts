import DirectoryTransformer from '#features/directories/transformers/directory_transformer'
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import {
  moveNoteValidator,
  noteIdValidator,
  saveNoteValidator,
} from '../validators/note_validator.ts'
import NotesService from '../services/notes_service.ts'
import NoteTransformer from '../transformers/note_transformer.ts'

@inject()
export default class NotesController {
  constructor(protected readonly notesService: NotesService) {}

  async index({ caller, serialize }: HttpContext) {
    const { directories, notes } = await this.notesService.listNotes(caller)

    return serialize.withoutWrapping({
      directories: DirectoryTransformer.transform(directories).useVariant('withNotes').depth(2),
      notes: NoteTransformer.transform(notes),
    })
  }

  async trash({ caller, serialize }: HttpContext) {
    const { directories, notes } = await this.notesService.listTrash(caller)

    return serialize.withoutWrapping({
      directories: DirectoryTransformer.transform(directories),
      notes: NoteTransformer.transform(notes),
    })
  }

  async store({ request, caller, response }: HttpContext) {
    const note = await request.validateUsing(saveNoteValidator)

    await this.notesService.saveNote({ caller, note })

    return response.noContent()
  }

  async move({ request, caller, response }: HttpContext) {
    const note = await request.validateUsing(moveNoteValidator)

    await this.notesService.moveNote({ caller, note })

    return response.noContent()
  }

  async softDelete({ request, caller, response }: HttpContext) {
    const { noteId } = await request.validateUsing(noteIdValidator)

    await this.notesService.softDeleteNote({ caller, noteId })

    return response.noContent()
  }

  async recover({ request, caller, response }: HttpContext) {
    const { noteId } = await request.validateUsing(noteIdValidator)

    await this.notesService.recoverNote({ caller, noteId })

    return response.noContent()
  }

  async destroy({ request, caller, response }: HttpContext) {
    const { noteId } = await request.validateUsing(noteIdValidator)

    await this.notesService.deleteNote({ caller, noteId })

    return response.noContent()
  }
}
