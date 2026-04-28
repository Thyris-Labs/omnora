import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const EnvironmentsController = () => import('#features/environments/controllers/environments_controller')

router
  .group(() => {
    router.post('create', [EnvironmentsController, 'store'])
  })
  .prefix('/api/v1/environments')
  .as('environments')
  .use(middleware.app_auth())
