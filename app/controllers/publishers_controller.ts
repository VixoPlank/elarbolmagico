import type { HttpContext } from '@adonisjs/core/http'
import Publisher from '#models/publisher'
import vine from '@vinejs/vine'

export default class PublishersController {
  /**
   * Display a list of resource
   */
  async index({ inertia, request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 10))
    const query = request.input('query', '')

    const publishersQuery = Publisher.query()
      .if(query, (q) => {
        q.where('name', 'ilike', `%${query}%`)
      })
      .orderBy('name', 'asc')

    const publishers = await publishersQuery.paginate(page, limit)

    // Maintain query params in pagination links
    publishers.queryString(request.qs())

    return (inertia.render as any)('owner/publishers/index', {
      publishers: publishers.toJSON(),
      filters: { query },
    })
  }

  /**
   * Handle form submission for a new resource
   */
  async store({ request, response, session }: HttpContext) {
    const validator = vine.compile(
      vine.object({
        name: vine.string().trim().minLength(2).maxLength(100),
      })
    )

    const data = await request.validateUsing(validator)

    // Check if publisher already exists
    const existing = await Publisher.findBy('name', data.name)
    if (existing) {
      session.flash('errors', { name: 'Esta editorial ya existe' })
      return response.redirect().back()
    }

    await Publisher.create(data)

    session.flash('success', 'Editorial creada correctamente')
    return response.redirect().back()
  }

  /**
   * Handle form submission for updating an existing resource
   */
  async update({ params, request, response, session }: HttpContext) {
    const validator = vine.compile(
      vine.object({
        name: vine.string().trim().minLength(2).maxLength(100),
      })
    )

    const data = await request.validateUsing(validator)
    const publisher = await Publisher.findOrFail(params.id)

    // Check if name is taken by another publisher
    const existing = await Publisher.query()
      .where('name', data.name)
      .whereNot('id', params.id)
      .first()

    if (existing) {
      session.flash('errors', { name: 'Ya existe otra editorial con este nombre' })
      return response.redirect().back()
    }

    publisher.name = data.name
    await publisher.save()

    session.flash('success', 'Editorial actualizada correctamente')
    return response.redirect().back()
  }

  /**
   * Delete record
   */
  async destroy({ params, response, session }: HttpContext) {
    const publisher = await Publisher.findOrFail(params.id)

    // Check if publisher has products
    await publisher.loadCount('products')
    if (Number(publisher.$extras.products_count) > 0) {
      session.flash('error', 'No se puede eliminar una editorial que tiene productos asociados')
      return response.redirect().back()
    }

    await publisher.delete()

    session.flash('success', 'Editorial eliminada correctamente')
    return response.redirect().back()
  }
}
