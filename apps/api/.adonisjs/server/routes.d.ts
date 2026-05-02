import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'directories.directories.store': { paramsTuple?: []; params?: {} }
    'directories.directories.update': { paramsTuple?: []; params?: {} }
    'directories.directories.move': { paramsTuple?: []; params?: {} }
    'environments.environments.store': { paramsTuple?: []; params?: {} }
    'notes.notes.index': { paramsTuple?: []; params?: {} }
    'notes.notes.store': { paramsTuple?: []; params?: {} }
    'notes.notes.move': { paramsTuple?: []; params?: {} }
    'auth.auth.verify_email': { paramsTuple?: []; params?: {} }
    'auth.auth.check_username': { paramsTuple?: []; params?: {} }
    'auth.auth.signup': { paramsTuple?: []; params?: {} }
    'auth.auth.signin': { paramsTuple?: []; params?: {} }
    'auth.auth.check': { paramsTuple?: []; params?: {} }
    'auth.auth.logout': { paramsTuple?: []; params?: {} }
    'users.users.setup': { paramsTuple?: []; params?: {} }
    'users.users.update': { paramsTuple?: []; params?: {} }
    'users.users.update_avatar': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'directories.directories.store': { paramsTuple?: []; params?: {} }
    'environments.environments.store': { paramsTuple?: []; params?: {} }
    'notes.notes.store': { paramsTuple?: []; params?: {} }
    'auth.auth.verify_email': { paramsTuple?: []; params?: {} }
    'auth.auth.check_username': { paramsTuple?: []; params?: {} }
    'auth.auth.signup': { paramsTuple?: []; params?: {} }
    'auth.auth.signin': { paramsTuple?: []; params?: {} }
    'auth.auth.logout': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'directories.directories.update': { paramsTuple?: []; params?: {} }
    'directories.directories.move': { paramsTuple?: []; params?: {} }
    'notes.notes.move': { paramsTuple?: []; params?: {} }
    'users.users.update': { paramsTuple?: []; params?: {} }
    'users.users.update_avatar': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'notes.notes.index': { paramsTuple?: []; params?: {} }
    'auth.auth.check': { paramsTuple?: []; params?: {} }
    'users.users.setup': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'notes.notes.index': { paramsTuple?: []; params?: {} }
    'auth.auth.check': { paramsTuple?: []; params?: {} }
    'users.users.setup': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}