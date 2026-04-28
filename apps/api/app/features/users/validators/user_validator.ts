import vine from '@vinejs/vine'

export const updateUserValidator = vine.create({
  displayName: vine.string().maxLength(24),
  username: vine.string().alphaNumeric({ allowUnderscores: true }).maxLength(24),
})

export const updateAvatarValidator = vine.create({
  avatar: vine.file({ extnames: ['png', 'jpeg', 'jpg', 'webp'], size: '10mb' }),
})
