import cache from '@adonisjs/cache/services/main'
import { err, isErr, ok, type Result } from '../../../shared/errors.ts'
import User from '../models/user.ts'
import mail from '@adonisjs/mail/services/main'

type VerifyEmailErr = 'ERR_USER_ALREADY_EXIST'
type CheckUsernameErr = 'ERR_USERNAME_ALREADY_EXIST'
type SignupErr =
  | 'ERR_USER_ALREADY_EXIST'
  | 'ERR_USERNAME_ALREADY_EXIST'
  | 'ERR_INVALID_VERIFICATION_CODE'
type SigninErr = 'ERR_INVALID_VERIFICATION_CODE' | 'ERR_USER_NOT_FOUND'

const USER_AVATAR = 'https://i.pinimg.com/1200x/92/41/92/924192b2cdbec6802e7fe4229e2e1bd9.jpg'

export default class AuthService {
  async verifyEmail({
    email,
    flow,
  }: {
    email: string
    flow: 'signup' | 'signin'
  }): Promise<Result<void, VerifyEmailErr>> {
    if (flow === 'signup') {
      const unique = await this.#checkUniqueness(email)
      if (isErr(unique)) return unique
    }

    const code = this.#generateCode()
    await cache.set({ key: `verif:${email}`, value: code, ttl: '10m' })

    void mail.sendLater((message) => {
      message
        .to(email)
        .subject(`Please verify your email.`)
        .text(`Use ${code} to verify your email.`)
    })

    return ok()
  }

  async checkUsername({ username }: { username: string }): Promise<Result<void, CheckUsernameErr>> {
    return this.#checkUsernameUniqueness(username)
  }

  async signup({
    email,
    username,
    code,
  }: {
    email: string
    username: string
    code: string
  }): Promise<Result<{ user: User }, SignupErr>> {
    const codeCheck = await this.#checkCode(email, code)
    if (isErr(codeCheck)) return codeCheck

    const uniqueEmail = await this.#checkUniqueness(email)
    if (isErr(uniqueEmail)) return uniqueEmail

    const uniqueUsername = await this.#checkUsernameUniqueness(username)
    if (isErr(uniqueUsername)) return uniqueUsername

    const user = await User.create({
      id: crypto.randomUUID(),
      email,
      username,
      displayName: username,
      avatar: USER_AVATAR,
    })
    return ok({
      user,
    })
  }

  async signin({
    email,
    code,
  }: {
    email: string
    code: string
  }): Promise<Result<{ user: User }, SigninErr>> {
    const codeCheck = await this.#checkCode(email, code)
    if (isErr(codeCheck)) return codeCheck

    const user = await User.findBy('email', email)
    if (!user) return err('ERR_USER_NOT_FOUND', 'No account was found for this email.')

    return ok({ user })
  }

  #generateCode(len = 6) {
    return crypto
      .getRandomValues(new Uint8Array(len))
      .reduce((acc, value) => acc + (value % 10).toString(), '')
  }

  async #checkUniqueness(email: string): Promise<Result<void, VerifyEmailErr>> {
    const exist = await User.findBy('email', email)
    if (exist) return err('ERR_USER_ALREADY_EXIST', 'This email is already in use.')
    return ok()
  }

  async #checkUsernameUniqueness(
    username: string
  ): Promise<Result<void, 'ERR_USERNAME_ALREADY_EXIST'>> {
    const exist = await User.findBy('username', username)
    if (exist) return err('ERR_USERNAME_ALREADY_EXIST', 'This username is already in use.')
    return ok()
  }

  async #checkCode(
    email: string,
    code: string
  ): Promise<Result<void, 'ERR_INVALID_VERIFICATION_CODE'>> {
    const generatedCode = await cache.get<string>({ key: `verif:${email}` })
    if (!generatedCode || generatedCode !== code) {
      return err(
        'ERR_INVALID_VERIFICATION_CODE',
        'The verification code is invalid or has expired.'
      )
    }

    await cache.delete({ key: `verif:${email}` })
    return ok()
  }
}
