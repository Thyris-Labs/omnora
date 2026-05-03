/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  environments: {
    environments: {
      store: typeof routes['environments.environments.store']
    }
  }
  auth: {
    auth: {
      verifyEmail: typeof routes['auth.auth.verify_email']
      checkUsername: typeof routes['auth.auth.check_username']
      signup: typeof routes['auth.auth.signup']
      signin: typeof routes['auth.auth.signin']
      check: typeof routes['auth.auth.check']
      logout: typeof routes['auth.auth.logout']
    }
  }
  users: {
    users: {
      setup: typeof routes['users.users.setup']
      update: typeof routes['users.users.update']
      updateAvatar: typeof routes['users.users.update_avatar']
    }
  }
}
