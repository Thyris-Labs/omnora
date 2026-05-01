import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const NotesController = () => import('#features/notes/controllers/notes_controller')

router
  .group(() => {
    router.get('', [NotesController, 'index'])
    router.post('save', [NotesController, 'store'])
  })
  .prefix('/api/v1/notes')
  .as('notes')
  .use(middleware.app_auth())
