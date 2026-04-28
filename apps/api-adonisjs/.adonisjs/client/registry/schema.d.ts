/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'auth.auth.verify_email': {
    methods: ["POST"]
    pattern: '/api/v1/auth/verify'
    types: {
      body: ExtractBody<InferInput<(typeof import('#features/users/validators/auth_validator').verifyEmailValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#features/users/validators/auth_validator').verifyEmailValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#features/users/controllers/auth_controller').default['verifyEmail']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#features/users/controllers/auth_controller').default['verifyEmail']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.auth.signup': {
    methods: ["POST"]
    pattern: '/api/v1/auth/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#features/users/validators/auth_validator').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#features/users/validators/auth_validator').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#features/users/controllers/auth_controller').default['signup']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#features/users/controllers/auth_controller').default['signup']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.auth.signin': {
    methods: ["POST"]
    pattern: '/api/v1/auth/signin'
    types: {
      body: ExtractBody<InferInput<(typeof import('#features/users/validators/auth_validator').signinValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#features/users/validators/auth_validator').signinValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#features/users/controllers/auth_controller').default['signin']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#features/users/controllers/auth_controller').default['signin']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.auth.check': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/auth/check'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#features/users/controllers/auth_controller').default['check']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#features/users/controllers/auth_controller').default['check']>>>
    }
  }
}
