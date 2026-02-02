import type { HttpContext } from '@adonisjs/core/http'
import Topic from '#models/topic'
import vine from '@vinejs/vine'

export default class TopicsController {
  /**
   * Display a list of resource
   */
  async index({ inertia, request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 10))
    const query = request.input('query', '')

    const topicsQuery = Topic.query()
      .if(query, (q) => {
        q.where('name', 'ilike', `%${query}%`)
      })
      .orderBy('name', 'asc')

    const topics = await topicsQuery.paginate(page, limit)

    // Maintain query params in pagination links
    topics.queryString(request.qs())

    return (inertia.render as any)('owner/topics/index', {
      topics: topics.toJSON(),
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

    // Check if topic already exists
    const existing = await Topic.findBy('name', data.name)
    if (existing) {
      session.flash('errors', { name: 'Esta temática ya existe' })
      return response.redirect().back()
    }

    await Topic.create(data)

    session.flash('success', 'Temática creada correctamente')
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
    const topic = await Topic.findOrFail(params.id)

    // Check if name is taken by another topic
    const existing = await Topic.query().where('name', data.name).whereNot('id', params.id).first()

    if (existing) {
      session.flash('errors', { name: 'Ya existe otra temática con este nombre' })
      return response.redirect().back()
    }

    topic.name = data.name
    await topic.save()

    session.flash('success', 'Temática actualizada correctamente')
    return response.redirect().back()
  }

  /**
   * Delete record
   */
  async destroy({ params, response, session }: HttpContext) {
    const topic = await Topic.findOrFail(params.id)

    // Check if topic has products
    await topic.loadCount('products')
    if (Number(topic.$extras.products_count) > 0) {
      session.flash('error', 'No se puede eliminar una temática que tiene productos asociados')
      return response.redirect().back()
    }

    await topic.delete()

    session.flash('success', 'Temática eliminada correctamente')
    return response.redirect().back()
  }
}
