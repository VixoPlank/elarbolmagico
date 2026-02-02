import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { Role } from '#enums/role'

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user
    if (!user || user.role !== Role.OWNER) {
      return ctx.response.redirect().toRoute('dashboard')
    }
    return next()
  }
}
