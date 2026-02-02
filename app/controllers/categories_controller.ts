import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import vine from '@vinejs/vine'

export default class CategoriesController {
  /**
   * Display a list of resource
   */
  async index({ inertia, request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 10))
    const query = request.input('query', '')

    const categoriesQuery = Category.query()
      .if(query, (q) => {
        q.where('name', 'ilike', `%${query}%`)
      })
      .orderBy('name', 'asc')

    const categories = await categoriesQuery.paginate(page, limit)

    // Maintain query params in pagination links
    categories.queryString(request.qs())

    return (inertia.render as any)('owner/categories/index', {
      categories: categories.toJSON(),
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

    // Check if category already exists
    const existing = await Category.findBy('name', data.name)
    if (existing) {
      session.flash('errors', { name: 'Esta categoría ya existe' })
      return response.redirect().back()
    }

    await Category.create(data)

    session.flash('success', 'Categoría creada correctamente')
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
    const category = await Category.findOrFail(params.id)

    // Check if name is taken by another category
    const existing = await Category.query()
      .where('name', data.name)
      .whereNot('id', params.id)
      .first()

    if (existing) {
      session.flash('errors', { name: 'Ya existe otra categoría con este nombre' })
      return response.redirect().back()
    }

    category.name = data.name
    await category.save()

    session.flash('success', 'Categoría actualizada correctamente')
    return response.redirect().back()
  }

  /**
   * Delete record
   */
  async destroy({ params, response, session }: HttpContext) {
    const category = await Category.findOrFail(params.id)

    // Check if category has products
    await category.loadCount('products')
    if (Number(category.$extras.products_count) > 0) {
      session.flash('error', 'No se puede eliminar una categoría que tiene productos asociados')
      return response.redirect().back()
    }

    await category.delete()

    session.flash('success', 'Categoría eliminada correctamente')
    return response.redirect().back()
  }
}
