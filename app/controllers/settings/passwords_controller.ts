import { randomUUID } from 'node:crypto'
import type { HttpContext } from '@adonisjs/core/http'
import { updatePasswordValidator } from '#validators/auth'
import hash from '@adonisjs/core/services/hash'

export default class PasswordsController {
  async edit({ inertia }: HttpContext) {
    return inertia.render('settings/password', {})
  }

  async update({ request, auth, response, session }: HttpContext) {
    const data = await request.validateUsing(updatePasswordValidator)
    const user = auth.user!

    // Verify current password
    const isValid = await hash.verify(user.password, data.currentPassword)
    if (!isValid) {
      session.flash(
        'toast',
        JSON.stringify({
          id: randomUUID(),
          message: 'La contraseña actual es incorrecta.',
          status: 'error',
        })
      )
      return response.redirect().back()
    }

    user.password = data.password
    await user.save()

    session.flash(
      'toast',
      JSON.stringify({
        id: randomUUID(),
        message: '¡Tu contraseña ha sido actualizada exitosamente!',
        status: 'success',
      })
    )

    return response.redirect().back()
  }
}
