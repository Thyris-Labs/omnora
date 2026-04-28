import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import User from '#features/users/models/user'

/**
 * Augment the HttpContext interface to add the caller property.
 * This makes TypeScript aware of the new property.
 */
declare module '@adonisjs/core/http' {
  interface HttpContext {
    caller: User
  }
}

/**
 * App auth middleware is used authenticate HTTP requests from the app and deny
 * access to unauthenticated users.
 */
export default class AppAuthMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    const user = await ctx.auth.authenticateUsing(options.guards)
    if (!(user instanceof User)) {
      throw new Error('Not an app user')
    }

    ctx.caller = user

    return next()
  }
}
