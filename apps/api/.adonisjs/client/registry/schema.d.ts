/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'directories.directories.store': {
    methods: ["POST"]
    pattern: '/api/v1/directories/create'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/features/directories/validators/directory_validator').createDirectoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/features/directories/validators/directory_validator').createDirectoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#features/directories/controllers/directories_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#features/directories/controllers/directories_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'directories.directories.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/directories/edit'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/features/directories/validators/directory_validator').editDirectoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/features/directories/validators/directory_validator').editDirectoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#features/directories/controllers/directories_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#features/directories/controllers/directories_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'directories.directories.move': {
    methods: ["PATCH"]
    pattern: '/api/v1/directories/move'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/features/directories/validators/directory_validator').moveDirectoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/features/directories/validators/directory_validator').moveDirectoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#features/directories/controllers/directories_controller').default['move']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#features/directories/controllers/directories_controller').default['move']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'environments.environments.store': {
    methods: ["POST"]
    pattern: '/api/v1/environments/create'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/features/environments/validators/environment_validator').createEnvironmentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/features/environments/validators/environment_validator').createEnvironmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#features/environments/controllers/environments_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#features/environments/controllers/environments_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'notes.notes.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/notes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#features/notes/controllers/notes_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#features/notes/controllers/notes_controller').default['index']>>>
    }
  }
  'notes.notes.store': {
    methods: ["POST"]
    pattern: '/api/v1/notes/save'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/features/notes/validators/note_validator').saveNoteValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/features/notes/validators/note_validator').saveNoteValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#features/notes/controllers/notes_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#features/notes/controllers/notes_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'notes.notes.move': {
    methods: ["PATCH"]
    pattern: '/api/v1/notes/move'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/features/notes/validators/note_validator').moveNoteValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/features/notes/validators/note_validator').moveNoteValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#features/notes/controllers/notes_controller').default['move']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#features/notes/controllers/notes_controller').default['move']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
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
  'auth.auth.check_username': {
    methods: ["POST"]
    pattern: '/api/v1/auth/check_username'
    types: {
      body: ExtractBody<InferInput<(typeof import('#features/users/validators/auth_validator').checkUsernameValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#features/users/validators/auth_validator').checkUsernameValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#features/users/controllers/auth_controller').default['checkUsername']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#features/users/controllers/auth_controller').default['checkUsername']>>> | { status: 422; response: { errors: SimpleError[] } }
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
  'auth.auth.logout': {
    methods: ["POST"]
    pattern: '/api/v1/auth/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#features/users/controllers/auth_controller').default['logout']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#features/users/controllers/auth_controller').default['logout']>>>
    }
  }
  'users.users.setup': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/users/setup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#features/users/controllers/users_controller').default['setup']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#features/users/controllers/users_controller').default['setup']>>>
    }
  }
  'users.users.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/users/edit'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/features/users/validators/user_validator').updateUserValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/features/users/validators/user_validator').updateUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#features/users/controllers/users_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#features/users/controllers/users_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'users.users.update_avatar': {
    methods: ["PATCH"]
    pattern: '/api/v1/users/avatar'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/features/users/validators/user_validator').updateAvatarValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/features/users/validators/user_validator').updateAvatarValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#features/users/controllers/users_controller').default['updateAvatar']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#features/users/controllers/users_controller').default['updateAvatar']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
}
