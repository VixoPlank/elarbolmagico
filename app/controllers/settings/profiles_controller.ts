import { randomUUID } from 'node:crypto'
import type { HttpContext } from '@adonisjs/core/http'
import { updateProfileValidator } from '#validators/user'

export default class ProfilesController {
  async edit({ inertia }: HttpContext) {
    return inertia.render('settings/profile', {})
  }

  async update({ request, auth, response, session }: HttpContext) {
    const data = await request.validateUsing(updateProfileValidator)
    const user = auth.user!

    user.merge(data)
    await user.save()

    session.flash(
      'toast',
      JSON.stringify({
        id: randomUUID(),
        message: 'Perfil actualizado con éxito',
        status: 'success',
      })
    )

    return response.redirect().back()
  }
}
