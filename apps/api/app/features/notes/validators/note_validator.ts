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

export type SaveNotePayload = Infer<typeof saveNoteValidator>
