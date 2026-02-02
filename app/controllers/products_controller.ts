import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { ProductType } from '#enums/product'
import {
  createProductValidator,
  updateProductValidator,
  adjustStockValidator,
} from '#validators/product'
import Author from '#models/author'
import Publisher from '#models/publisher'
import Topic from '#models/topic'
import Category from '#models/category'
import Brand from '#models/brand'
import StockMovement from '#models/stock_movement'
import { StockMovementType } from '#enums/stock_movement'

export default class ProductsController {
  async index({ inertia }: HttpContext) {
    return inertia.render('owner/stock/index', {})
  }

  async indexBooks({ inertia, request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 10))
    const query = request.input('query', '')

    const products = await Product.query()
      .where('type', ProductType.BOOK)
      .preload('author')
      .preload('publisher')
      .preload('topic')
      .if(query, (q) => {
        q.where('name', 'ilike', `%${query}%`)
          .orWhere('barCode', 'ilike', `%${query}%`)
          .orWhereHas('author', (aq) => aq.where('name', 'ilike', `%${query}%`))
      })
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    products.queryString(request.qs())

    const authors = await Author.query().orderBy('name', 'asc')
    const publishers = await Publisher.query().orderBy('name', 'asc')
    const topics = await Topic.query().orderBy('name', 'asc')

    return inertia.render('owner/stock/books/page', {
      products,
      authors,
      publishers,
      topics,
      filters: { query },
    } as any)
  }

  async indexOthers({ inertia, request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 10))
    const query = request.input('query', '')

    const products = await Product.query()
      .whereNot('type', ProductType.BOOK)
      .preload('brand')
      .preload('category')
      .if(query, (q) => {
        q.where('name', 'ilike', `%${query}%`).orWhere('barCode', 'ilike', `%${query}%`)
      })
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    products.queryString(request.qs())

    const categories = await Category.query().orderBy('name', 'asc')
    const brands = await Brand.query().orderBy('name', 'asc')

    return inertia.render('owner/stock/products/page', {
      products,
      categories,
      brands,
      filters: { query },
    } as any)
  }

  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(createProductValidator)
    const product = await Product.create({
      ...data,
      createdBy: auth.user?.id,
    })

    // Record initial stock as movement if > 0
    if (product.stock > 0) {
      await StockMovement.create({
        productId: product.id,
        quantity: product.stock,
        type: StockMovementType.IN,
        reason: 'Initial stock',
        performedBy: auth.user!.id,
      })
    }

    return response.redirect().back()
  }

  async update({ params, request, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const data = await request.validateUsing(updateProductValidator)

    product.merge(data)
    await product.save()

    return response.redirect().back()
  }

  async adjustStock({ params, request, response, auth }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const { stock: adjustment, reason } = await request.validateUsing(adjustStockValidator)

    product.stock += adjustment

    if (product.stock < 0) {
      return response.status(400).send({ error: 'El stock no puede ser negativo' })
    }

    await product.save()

    await StockMovement.create({
      productId: product.id,
      quantity: Math.abs(adjustment),
      type: adjustment > 0 ? StockMovementType.IN : StockMovementType.OUT,
      reason: reason || (adjustment > 0 ? 'Ajuste de entrada' : 'Ajuste de salida'),
      performedBy: auth.user!.id,
    })

    return response.redirect().back()
  }

  async destroy({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()
    return response.redirect().back()
  }
}
