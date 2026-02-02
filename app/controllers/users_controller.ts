import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { Role } from '#enums/role'
import vine from '@vinejs/vine'

export default class UsersController {
  async index({ inertia, request, auth }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 10
    const search = request.input('search', '')
    const currentUser = auth.user!

    const users = await User.query()
      .whereNot('role', Role.SUPER_ADMIN)
      .whereNot('id', currentUser.id) // Don't show yourself
      .where((query) => {
        if (search) {
          query
            .whereILike('firstName', `%${search}%`)
            .orWhereILike('lastName', `%${search}%`)
            .orWhereILike('email', `%${search}%`)
        }
      })
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    return (inertia.render as any)('owner/users/index', {
      users: users.serialize(),
      filters: {
        search,
      },
      currentUserRole: currentUser.role,
    })
  }

  async store({ request, response }: HttpContext) {
    const schema = vine.object({
      firstName: vine.string().maxLength(50),
      lastName: vine.string().maxLength(50),
      email: vine
        .string()
        .email()
        .unique(async (db, value) => {
          const user = await db.from('users').where('email', value).first()
          return !user
        }),
      password: vine.string().minLength(8),
      role: vine.enum([Role.EMPLOYEE, Role.USER]),
    })

    const payload = await vine.validate({ schema, data: request.all() })

    await User.create({
      ...payload,
      isActive: true,
    })

    return response.redirect().back()
  }

  async update({ request, response, params }: HttpContext) {
    const user = await User.findOrFail(params.id)

    // Only allow toggling status
    const schema = vine.object({
      isActive: vine.boolean(),
    })

    const payload = await vine.validate({ schema, data: request.all() })

    user.isActive = payload.isActive
    await user.save()

    return response.redirect().back()
  }
}
