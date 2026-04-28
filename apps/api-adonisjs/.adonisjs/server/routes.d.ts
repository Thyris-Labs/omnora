import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.auth.verify_email': { paramsTuple?: []; params?: {} }
    'auth.auth.signup': { paramsTuple?: []; params?: {} }
    'auth.auth.signin': { paramsTuple?: []; params?: {} }
    'auth.auth.check': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.auth.verify_email': { paramsTuple?: []; params?: {} }
    'auth.auth.signup': { paramsTuple?: []; params?: {} }
    'auth.auth.signin': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'auth.auth.check': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'auth.auth.check': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}