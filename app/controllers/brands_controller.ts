import type { HttpContext } from '@adonisjs/core/http'
import Brand from '#models/brand'
import vine from '@vinejs/vine'

export default class BrandsController {
  /**
   * Display a list of resource
   */
  async index({ inertia, request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 10))
    const query = request.input('query', '')

    const brandsQuery = Brand.query()
      .if(query, (q) => {
        q.where('name', 'ilike', `%${query}%`)
      })
      .orderBy('name', 'asc')

    const brands = await brandsQuery.paginate(page, limit)

    // Maintain query params in pagination links
    brands.queryString(request.qs())

    return (inertia.render as any)('owner/brands/index', {
      brands: brands.toJSON(),
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

    // Check if brand already exists
    const existing = await Brand.findBy('name', data.name)
    if (existing) {
      session.flash('errors', { name: 'Esta marca ya existe' })
      return response.redirect().back()
    }

    await Brand.create(data)

    session.flash('success', 'Marca creada correctamente')
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
    const brand = await Brand.findOrFail(params.id)

    // Check if name is taken by another brand
    const existing = await Brand.query().where('name', data.name).whereNot('id', params.id).first()

    if (existing) {
      session.flash('errors', { name: 'Ya existe otra marca con este nombre' })
      return response.redirect().back()
    }

    brand.name = data.name
    await brand.save()

    session.flash('success', 'Marca actualizada correctamente')
    return response.redirect().back()
  }

  /**
   * Delete record
   */
  async destroy({ params, response, session }: HttpContext) {
    const brand = await Brand.findOrFail(params.id)

    // Check if brand has products
    await brand.loadCount('products')
    if (Number(brand.$extras.products_count) > 0) {
      session.flash('error', 'No se puede eliminar una marca que tiene productos asociados')
      return response.redirect().back()
    }

    await brand.delete()

    session.flash('success', 'Marca eliminada correctamente')
    return response.redirect().back()
  }
}
