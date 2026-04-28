import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'environments.environments.store': { paramsTuple?: []; params?: {} }
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
    'environments.environments.store': { paramsTuple?: []; params?: {} }
    'auth.auth.verify_email': { paramsTuple?: []; params?: {} }
    'auth.auth.check_username': { paramsTuple?: []; params?: {} }
    'auth.auth.signup': { paramsTuple?: []; params?: {} }
    'auth.auth.signin': { paramsTuple?: []; params?: {} }
    'auth.auth.logout': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'auth.auth.check': { paramsTuple?: []; params?: {} }
    'users.users.setup': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'auth.auth.check': { paramsTuple?: []; params?: {} }
    'users.users.setup': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'users.users.update': { paramsTuple?: []; params?: {} }
    'users.users.update_avatar': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}