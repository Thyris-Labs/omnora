import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const AuthController = () => import('#features/users/controllers/auth_controller')
const UsersController = () => import('#features/users/controllers/users_controller')

router
  .group(() => {
    router.post('verify', [AuthController, 'verifyEmail'])
    router.post('check_username', [AuthController, 'checkUsername'])
    router.post('signup', [AuthController, 'signup'])
    router.post('signin', [AuthController, 'signin'])
    router.get('check', [AuthController, 'check'])
    router.post('logout', [AuthController, 'logout']).use(middleware.app_auth())
  })
  .prefix('/api/v1/auth')
  .as('auth')

router
  .group(() => {
    router.get('setup', [UsersController, 'setup'])
    router.patch('edit', [UsersController, 'update'])
    router.patch('avatar', [UsersController, 'updateAvatar'])
  })
  .prefix('/api/v1/users')
  .as('users')
  .use(middleware.app_auth())
