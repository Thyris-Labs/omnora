import vine from '@vinejs/vine'

type AuthFlow = 'signup' | 'signin'

/**
 * Shared rules
 */
const code = () => vine.string().alphaNumeric().fixedLength(6)
const email = (flow: AuthFlow) => {
  const base = vine.string().email().maxLength(254)

  if (flow === 'signup') return base.unique({ table: 'users', column: 'email' })
  return base
}

/**
 * Validator to use when performing email verification
 */
export const verifyEmailValidator = vine.create({
  email: vine.string().email().maxLength(254),
  flow: vine.enum(['signup', 'signin']),
})

/**
 * Validator to use for signup
 */
export const signupValidator = vine.create({
  email: email('signup'),
  username: vine.string().alphaNumeric({ allowUnderscores: true }).maxLength(24),
  code: code(),
})

/**
 * Validator to use for signin
 */
export const signinValidator = vine.create({
  email: email('signin'),
  code: code(),
})

export const checkUsernameValidator = vine.create({
  username: vine.string().alphaNumeric({ allowUnderscores: true }).maxLength(24),
})
