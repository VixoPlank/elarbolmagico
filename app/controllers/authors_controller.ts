import type { HttpContext } from '@adonisjs/core/http'
import Author from '#models/author'
import vine from '@vinejs/vine'

export default class AuthorsController {
  /**
   * Display a list of resource
   */
  async index({ inertia, request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 10))
    const query = request.input('query', '')

    const authorsQuery = Author.query()
      .if(query, (q) => {
        q.where('name', 'ilike', `%${query}%`).orWhere('country', 'ilike', `%${query}%`)
      })
      .withCount('products')
      .orderBy('name', 'asc')

    const authors = await authorsQuery.paginate(page, limit)

    // Maintain query params in pagination links
    authors.queryString(request.qs())

    const authorsJSON = authors.toJSON()

    // Explicitly rebuild the data array to ensure properties are correctly mapped
    authorsJSON.data = authorsJSON.data.map((author: any) => {
      return {
        id: author.id,
        name: author.name,
        country: author.country,
        bio: author.bio,
        img: author.img,
        createdAt: author.createdAt,
        productsCount: Number(author.$extras?.products_count || 0),
      }
    })

    // Load author books if requested
    const selectedAuthorId = request.input('authorId')
    let authorBooks = null
    let selectedAuthor = null

    if (selectedAuthorId) {
      selectedAuthor = await Author.find(selectedAuthorId)
      if (selectedAuthor) {
        const booksPage = Number(request.input('books_page', 1))
        const booksLimit = 5
        const books = await selectedAuthor
          .related('products')
          .query()
          .preload('publisher')
          .preload('category')
          .paginate(booksPage, booksLimit)

        books.queryString(request.qs())
        authorBooks = {
          ...books.toJSON(),
          authorId: selectedAuthorId,
        }
      }
    }

    return (inertia.render as any)('owner/authors/index', {
      authors: authorsJSON,
      filters: { query },
      selectedAuthor,
      authorBooks,
    })
  }

  /**
   * Handle form submission for a new resource
   */
  async store({ request, response, session }: HttpContext) {
    const validator = vine.compile(
      vine.object({
        name: vine.string().trim().minLength(2).maxLength(100),
        country: vine.string().trim(),
        bio: vine.string().trim().optional(),
        img: vine.string().trim().optional(),
      })
    )

    const data = await request.validateUsing(validator)

    // Auto-generate normalized name if needed (optional based on model)
    // For now, simple create
    await Author.create({
      ...data,
      normalizedName: data.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''),
    })

    session.flash('success', 'Autor creado correctamente')
    return response.redirect().back()
  }

  /**
   * Handle form submission for updating an existing resource
   */
  async update({ params, request, response, session }: HttpContext) {
    const validator = vine.compile(
      vine.object({
        name: vine.string().trim().minLength(2).maxLength(100),
        country: vine.string().trim(),
        bio: vine.string().trim().optional(),
        img: vine.string().trim().optional(),
      })
    )

    const data = await request.validateUsing(validator)
    const author = await Author.findOrFail(params.id)

    author.merge({
      ...data,
      normalizedName: data.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''),
    })
    await author.save()

    session.flash('success', 'Autor actualizado correctamente')
    return response.redirect().back()
  }

  /**
   * Delete record
   */
  async destroy({ params, response, session }: HttpContext) {
    const author = await Author.findOrFail(params.id)

    // Check if author has products
    await author.loadCount('products')
    if (Number(author.$extras.products_count) > 0) {
      session.flash('error', 'No se puede eliminar un autor que tiene libros asociados')
      return response.redirect().back()
    }

    await author.delete()

    session.flash('success', 'Autor eliminado correctamente')
    return response.redirect().back()
  }
}
