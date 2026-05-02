import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const DirectoriesController = () =>
  import('#features/directories/controllers/directories_controller')

router
  .group(() => {
    router.post('create', [DirectoriesController, 'store'])
    router.patch('edit', [DirectoriesController, 'update'])
    router.patch('move', [DirectoriesController, 'move'])
    router.patch('soft-delete', [DirectoriesController, 'softDelete'])
    router.patch('recover', [DirectoriesController, 'recover'])
    router.delete('delete', [DirectoriesController, 'destroy'])
  })
  .prefix('/api/v1/directories')
  .as('directories')
  .use(middleware.app_auth())
