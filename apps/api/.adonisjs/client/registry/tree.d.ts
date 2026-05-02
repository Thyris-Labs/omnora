/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  directories: {
    directories: {
      store: typeof routes['directories.directories.store']
      update: typeof routes['directories.directories.update']
      move: typeof routes['directories.directories.move']
      softDelete: typeof routes['directories.directories.soft_delete']
      recover: typeof routes['directories.directories.recover']
      destroy: typeof routes['directories.directories.destroy']
    }
  }
  environments: {
    environments: {
      store: typeof routes['environments.environments.store']
    }
  }
  notes: {
    notes: {
      index: typeof routes['notes.notes.index']
      trash: typeof routes['notes.notes.trash']
      store: typeof routes['notes.notes.store']
      move: typeof routes['notes.notes.move']
      softDelete: typeof routes['notes.notes.soft_delete']
      recover: typeof routes['notes.notes.recover']
      destroy: typeof routes['notes.notes.destroy']
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
