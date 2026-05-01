import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const createDirectoryValidator = vine.create({
  title: vine.string(),
  positionIdx: vine.number(),
  type: vine.enum(['NOTES', 'ARCHIVE']),
})

export type CreateDirectoryPayload = Infer<typeof createDirectoryValidator>
