import router from '@adonisjs/core/services/router'

const EnvironmentsController = () => import('#features/environments/controllers/environments_controller')

router
  .group(() => {
  })
  .prefix('/api/v1/environments')
  .as('environments')
