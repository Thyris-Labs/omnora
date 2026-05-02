import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const NotesController = () => import('#features/notes/controllers/notes_controller')

router
  .group(() => {
    router.get('', [NotesController, 'index'])
    router.get('trash', [NotesController, 'trash'])
    router.post('save', [NotesController, 'store'])
    router.patch('move', [NotesController, 'move'])
    router.patch('soft-delete', [NotesController, 'softDelete'])
    router.patch('recover', [NotesController, 'recover'])
    router.delete('delete', [NotesController, 'destroy'])
  })
  .prefix('/api/v1/notes')
  .as('notes')
  .use(middleware.app_auth())
