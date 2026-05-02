import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const createDirectoryValidator = vine.create({
  title: vine.string(),
  positionIdx: vine.number(),
  type: vine.enum(['NOTES', 'ARCHIVE']),
})

export const editDirectoryValidator = vine.create({
  directoryId: vine.string().uuid(),
  title: vine.string(),
})

export const moveDirectoryValidator = vine.create({
  directoryId: vine.string().uuid(),
  positionIdx: vine.number(),
})

export type CreateDirectoryPayload = Infer<typeof createDirectoryValidator>
export type MoveDirectoryPayload = Infer<typeof moveDirectoryValidator>
