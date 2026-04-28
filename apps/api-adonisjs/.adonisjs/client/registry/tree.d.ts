/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    auth: {
      verifyEmail: typeof routes['auth.auth.verify_email']
      signup: typeof routes['auth.auth.signup']
      signin: typeof routes['auth.auth.signin']
      check: typeof routes['auth.auth.check']
    }
  }
}
