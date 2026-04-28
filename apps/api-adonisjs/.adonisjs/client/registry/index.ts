/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.auth.verify_email': {
    methods: ["POST"],
    pattern: '/api/v1/auth/verify',
    tokens: [{"old":"/api/v1/auth/verify","type":0,"val":"api","end":""},{"old":"/api/v1/auth/verify","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/verify","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/verify","type":0,"val":"verify","end":""}],
    types: placeholder as Registry['auth.auth.verify_email']['types'],
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
