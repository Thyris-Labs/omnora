/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

// import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
// import { controllers } from '#generated/controllers'
import '#features/environments/routes'
import '#features/users/routes'

router.get('/', () => {
  return { hello: 'world' }
})
