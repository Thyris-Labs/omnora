import router from '@adonisjs/core/services/router'

const AuthController = () => import('#features/users/controllers/auth_controller')

router
  .group(() => {
    router.post('verify', [AuthController, 'verifyEmail'])
    router.post('signup', [AuthController, 'signup'])
    router.post('signin', [AuthController, 'signin'])
    router.get('check', [AuthController, 'check'])
  })
  .prefix('/api/v1/auth')
  .as('auth')
