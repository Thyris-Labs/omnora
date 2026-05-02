import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const saveNoteValidator = vine.create({
  id: vine.string().uuid(),
  directoryId: vine.string().uuid().nullable().optional(),
  positionIdx: vine.number().optional(),
  title: vine.string().optional(),
  rawContent: vine.any().optional(),
  content: vine.string().optional(),
})

export const moveNoteValidator = vine.create({
  noteId: vine.string().uuid(),
  directoryId: vine.string().uuid().nullable(),
  positionIdx: vine.number(),
})

export const noteIdValidator = vine.create({
  noteId: vine.string().uuid(),
})

export type SaveNotePayload = Infer<typeof saveNoteValidator>
export type MoveNotePayload = Infer<typeof moveNoteValidator>
export type NoteIdPayload = Infer<typeof noteIdValidator>
