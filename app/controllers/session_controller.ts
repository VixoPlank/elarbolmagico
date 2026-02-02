import User from '#models/user'
import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async create({ inertia, request }: HttpContext) {
    const email = request.qs().email
    const greeting = request.qs().greeting === 'true' || request.qs().greeting === '1'

    return inertia.render('auth/login', {
      canResetPassword: false,
      email: email || null,
      greeting: greeting || false,
    })
  }

  async store(ctx: HttpContext) {
    const { request, response, auth } = ctx
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      return response.redirect().toRoute('dashboard')
    } catch (error: any) {
      if (error.code === 'E_INVALID_CREDENTIALS') {
        ctx.toast('error', 'Credenciales inválidas, por favor intenta de nuevo.')
        return response.redirect().back()
      }

      throw error
    }
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    response.redirect().toRoute('login.show')
  }
}
