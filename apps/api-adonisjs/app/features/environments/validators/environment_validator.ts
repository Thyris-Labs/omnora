import vine from '@vinejs/vine'

export const createEnvironmentValidator = vine.create({
  name: vine.string().maxLength(24),
  avatar: vine.file({ extnames: ['png', 'jpeg', 'jpg'], size: '5mb' }),
})

