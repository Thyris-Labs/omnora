/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'directories.directories.store': {
    methods: ["POST"],
    pattern: '/api/v1/directories/create',
    tokens: [{"old":"/api/v1/directories/create","type":0,"val":"api","end":""},{"old":"/api/v1/directories/create","type":0,"val":"v1","end":""},{"old":"/api/v1/directories/create","type":0,"val":"directories","end":""},{"old":"/api/v1/directories/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['directories.directories.store']['types'],
  },
  'directories.directories.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/directories/edit',
    tokens: [{"old":"/api/v1/directories/edit","type":0,"val":"api","end":""},{"old":"/api/v1/directories/edit","type":0,"val":"v1","end":""},{"old":"/api/v1/directories/edit","type":0,"val":"directories","end":""},{"old":"/api/v1/directories/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['directories.directories.update']['types'],
  },
  'directories.directories.move': {
    methods: ["PATCH"],
    pattern: '/api/v1/directories/move',
    tokens: [{"old":"/api/v1/directories/move","type":0,"val":"api","end":""},{"old":"/api/v1/directories/move","type":0,"val":"v1","end":""},{"old":"/api/v1/directories/move","type":0,"val":"directories","end":""},{"old":"/api/v1/directories/move","type":0,"val":"move","end":""}],
    types: placeholder as Registry['directories.directories.move']['types'],
  },
  'directories.directories.soft_delete': {
    methods: ["PATCH"],
    pattern: '/api/v1/directories/soft-delete',
    tokens: [{"old":"/api/v1/directories/soft-delete","type":0,"val":"api","end":""},{"old":"/api/v1/directories/soft-delete","type":0,"val":"v1","end":""},{"old":"/api/v1/directories/soft-delete","type":0,"val":"directories","end":""},{"old":"/api/v1/directories/soft-delete","type":0,"val":"soft-delete","end":""}],
    types: placeholder as Registry['directories.directories.soft_delete']['types'],
  },
  'directories.directories.recover': {
    methods: ["PATCH"],
    pattern: '/api/v1/directories/recover',
    tokens: [{"old":"/api/v1/directories/recover","type":0,"val":"api","end":""},{"old":"/api/v1/directories/recover","type":0,"val":"v1","end":""},{"old":"/api/v1/directories/recover","type":0,"val":"directories","end":""},{"old":"/api/v1/directories/recover","type":0,"val":"recover","end":""}],
    types: placeholder as Registry['directories.directories.recover']['types'],
  },
  'directories.directories.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/directories/delete',
    tokens: [{"old":"/api/v1/directories/delete","type":0,"val":"api","end":""},{"old":"/api/v1/directories/delete","type":0,"val":"v1","end":""},{"old":"/api/v1/directories/delete","type":0,"val":"directories","end":""},{"old":"/api/v1/directories/delete","type":0,"val":"delete","end":""}],
    types: placeholder as Registry['directories.directories.destroy']['types'],
  },
  'environments.environments.store': {
    methods: ["POST"],
    pattern: '/api/v1/environments/create',
    tokens: [{"old":"/api/v1/environments/create","type":0,"val":"api","end":""},{"old":"/api/v1/environments/create","type":0,"val":"v1","end":""},{"old":"/api/v1/environments/create","type":0,"val":"environments","end":""},{"old":"/api/v1/environments/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['environments.environments.store']['types'],
  },
  'notes.notes.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/notes',
    tokens: [{"old":"/api/v1/notes","type":0,"val":"api","end":""},{"old":"/api/v1/notes","type":0,"val":"v1","end":""},{"old":"/api/v1/notes","type":0,"val":"notes","end":""}],
    types: placeholder as Registry['notes.notes.index']['types'],
  },
  'notes.notes.trash': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/notes/trash',
    tokens: [{"old":"/api/v1/notes/trash","type":0,"val":"api","end":""},{"old":"/api/v1/notes/trash","type":0,"val":"v1","end":""},{"old":"/api/v1/notes/trash","type":0,"val":"notes","end":""},{"old":"/api/v1/notes/trash","type":0,"val":"trash","end":""}],
    types: placeholder as Registry['notes.notes.trash']['types'],
  },
  'notes.notes.store': {
    methods: ["POST"],
    pattern: '/api/v1/notes/save',
    tokens: [{"old":"/api/v1/notes/save","type":0,"val":"api","end":""},{"old":"/api/v1/notes/save","type":0,"val":"v1","end":""},{"old":"/api/v1/notes/save","type":0,"val":"notes","end":""},{"old":"/api/v1/notes/save","type":0,"val":"save","end":""}],
    types: placeholder as Registry['notes.notes.store']['types'],
  },
  'notes.notes.move': {
    methods: ["PATCH"],
    pattern: '/api/v1/notes/move',
    tokens: [{"old":"/api/v1/notes/move","type":0,"val":"api","end":""},{"old":"/api/v1/notes/move","type":0,"val":"v1","end":""},{"old":"/api/v1/notes/move","type":0,"val":"notes","end":""},{"old":"/api/v1/notes/move","type":0,"val":"move","end":""}],
    types: placeholder as Registry['notes.notes.move']['types'],
  },
  'notes.notes.soft_delete': {
    methods: ["PATCH"],
    pattern: '/api/v1/notes/soft-delete',
    tokens: [{"old":"/api/v1/notes/soft-delete","type":0,"val":"api","end":""},{"old":"/api/v1/notes/soft-delete","type":0,"val":"v1","end":""},{"old":"/api/v1/notes/soft-delete","type":0,"val":"notes","end":""},{"old":"/api/v1/notes/soft-delete","type":0,"val":"soft-delete","end":""}],
    types: placeholder as Registry['notes.notes.soft_delete']['types'],
  },
  'notes.notes.recover': {
    methods: ["PATCH"],
    pattern: '/api/v1/notes/recover',
    tokens: [{"old":"/api/v1/notes/recover","type":0,"val":"api","end":""},{"old":"/api/v1/notes/recover","type":0,"val":"v1","end":""},{"old":"/api/v1/notes/recover","type":0,"val":"notes","end":""},{"old":"/api/v1/notes/recover","type":0,"val":"recover","end":""}],
    types: placeholder as Registry['notes.notes.recover']['types'],
  },
  'notes.notes.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/notes/delete',
    tokens: [{"old":"/api/v1/notes/delete","type":0,"val":"api","end":""},{"old":"/api/v1/notes/delete","type":0,"val":"v1","end":""},{"old":"/api/v1/notes/delete","type":0,"val":"notes","end":""},{"old":"/api/v1/notes/delete","type":0,"val":"delete","end":""}],
    types: placeholder as Registry['notes.notes.destroy']['types'],
  },
  'auth.auth.verify_email': {
    methods: ["POST"],
    pattern: '/api/v1/auth/verify',
    tokens: [{"old":"/api/v1/auth/verify","type":0,"val":"api","end":""},{"old":"/api/v1/auth/verify","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/verify","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/verify","type":0,"val":"verify","end":""}],
    types: placeholder as Registry['auth.auth.verify_email']['types'],
  },
  'auth.auth.check_username': {
    methods: ["POST"],
    pattern: '/api/v1/auth/check_username',
    tokens: [{"old":"/api/v1/auth/check_username","type":0,"val":"api","end":""},{"old":"/api/v1/auth/check_username","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/check_username","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/check_username","type":0,"val":"check_username","end":""}],
    types: placeholder as Registry['auth.auth.check_username']['types'],
  },
  'auth.auth.signup': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.auth.signup']['types'],
  },
  'auth.auth.signin': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signin',
    tokens: [{"old":"/api/v1/auth/signin","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signin","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signin","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signin","type":0,"val":"signin","end":""}],
    types: placeholder as Registry['auth.auth.signin']['types'],
  },
  'auth.auth.check': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/auth/check',
    tokens: [{"old":"/api/v1/auth/check","type":0,"val":"api","end":""},{"old":"/api/v1/auth/check","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/check","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/check","type":0,"val":"check","end":""}],
    types: placeholder as Registry['auth.auth.check']['types'],
  },
  'auth.auth.logout': {
    methods: ["POST"],
    pattern: '/api/v1/auth/logout',
    tokens: [{"old":"/api/v1/auth/logout","type":0,"val":"api","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.auth.logout']['types'],
  },
  'users.users.setup': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/users/setup',
    tokens: [{"old":"/api/v1/users/setup","type":0,"val":"api","end":""},{"old":"/api/v1/users/setup","type":0,"val":"v1","end":""},{"old":"/api/v1/users/setup","type":0,"val":"users","end":""},{"old":"/api/v1/users/setup","type":0,"val":"setup","end":""}],
    types: placeholder as Registry['users.users.setup']['types'],
  },
  'users.users.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/users/edit',
    tokens: [{"old":"/api/v1/users/edit","type":0,"val":"api","end":""},{"old":"/api/v1/users/edit","type":0,"val":"v1","end":""},{"old":"/api/v1/users/edit","type":0,"val":"users","end":""},{"old":"/api/v1/users/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['users.users.update']['types'],
  },
  'users.users.update_avatar': {
    methods: ["PATCH"],
    pattern: '/api/v1/users/avatar',
    tokens: [{"old":"/api/v1/users/avatar","type":0,"val":"api","end":""},{"old":"/api/v1/users/avatar","type":0,"val":"v1","end":""},{"old":"/api/v1/users/avatar","type":0,"val":"users","end":""},{"old":"/api/v1/users/avatar","type":0,"val":"avatar","end":""}],
    types: placeholder as Registry['users.users.update_avatar']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
