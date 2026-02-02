import { randomUUID } from 'node:crypto'
import type { HttpContext } from '@adonisjs/core/http'
import Sale from '#models/sale'
import SaleItem from '#models/sale_item'
import Product from '#models/product'
import StockMovement from '#models/stock_movement'
import { PaymentMethodType } from '#enums/payment_method'
import { StockMovementType } from '#enums/stock_movement'
import { createSaleValidator } from '#validators/sale'
import db from '@adonisjs/lucid/services/db'

export default class SalesController {
  async index({ inertia, request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 10))
    const query = request.input('query', '')

    const salesQuery = Sale.query()
      .preload('seller')
      .if(query, (q) => {
        // Search by receipt number
        if (/^\d+$/.test(query)) {
          q.whereRaw('CAST(receipt_number AS TEXT) ILIKE ?', [`%${query}%`])
        } else {
          // Search by seller name
          q.whereHas('seller', (sq) => {
            sq.where('first_name', 'ilike', `%${query}%`).orWhere(
              'last_name',
              'ilike',
              `%${query}%`
            )
          })

          // Search by payment method
          const qLower = query.toLowerCase()
          if (['cash', 'efectivo'].includes(qLower)) {
            q.orWhere('payment', PaymentMethodType.CASH)
          } else if (['card', 'tarjeta'].includes(qLower)) {
            q.orWhere('payment', PaymentMethodType.CARD)
          }
        }
      })
      .orderBy('createdAt', 'desc')

    const sales = await salesQuery.paginate(page, limit)

    sales.queryString(request.qs())

    // Map sales to match what the frontend expects (similar to reference)
    const serializedSales = sales.toJSON()
    serializedSales.data = serializedSales.data.map((sale: any) => ({
      id: sale.id,
      createdAt: sale.createdAt,
      receiptNumber: sale.receiptNumber.toString(),
      seller: `${sale.seller.firstName} ${sale.seller.lastName}`.trim(),
      total: sale.total,
      paymentMethod: sale.payment,
    }))

    return (inertia.render as any)('owner/sales/history', {
      sales: serializedSales,
      filters: { query },
    } as any)
  }

  async show({ params, response }: HttpContext) {
    const sale = await Sale.query()
      .where('id', params.id)
      .preload('seller')
      .preload('items', (iq) => {
        iq.preload('product')
      })
      .firstOrFail()

    const serializedSale = {
      id: sale.id,
      createdAt: sale.createdAt,
      receiptNumber: sale.receiptNumber.toString(),
      seller: `${sale.seller.firstName} ${sale.seller.lastName}`.trim(),
      total: sale.total,
      paymentMethod: sale.payment,
      items: sale.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.quantity * item.price,
      })),
    }

    return response.json(serializedSale)
  }

  async create({ inertia, request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 12))
    const query = request.input('query', '')

    const products = await Product.query()
      .if(query, (q) => {
        q.where('name', 'ilike', `%${query}%`).orWhere('barCode', 'ilike', `%${query}%`)
      })
      .orderBy('name', 'asc')
      .paginate(page, limit)

    products.queryString(request.qs())

    return (inertia.render as any)('owner/sales/create', {
      products: products.toJSON(),
      filters: { query },
    } as any)
  }

  async checkProduct({ request, response }: HttpContext) {
    const code = request.input('code')

    if (!code) {
      return response.badRequest('Code is required')
    }

    const product = await Product.query().where('barCode', code).first()

    if (!product) {
      return response.notFound('Product not found')
    }

    return response.json(product)
  }

  async store({ request, response, auth, session }: HttpContext) {
    const { paymentMethod, items } = await request.validateUsing(createSaleValidator)

    try {
      const { newSale, total } = await db.transaction(async (trx) => {
        // 1. Calculate total
        const total = items.reduce((acc: number, item: { price: number; quantity: number }) => {
          return acc + item.price * item.quantity
        }, 0)

        // 2. Create Sale
        const newSale = new Sale()
        newSale.fill({
          total,
          payment: paymentMethod,
          sellerId: auth.user!.id,
        })
        newSale.useTransaction(trx)
        await newSale.save()

        // 3. Create Items and Update Stock
        for (const item of items) {
          // Create sale item
          const saleItem = new SaleItem()
          saleItem.fill({
            saleId: newSale.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })
          saleItem.useTransaction(trx)
          await saleItem.save()

          // Update product stock - Lock the record for update if possible, or just fetch
          const product = await Product.findOrFail(item.productId)
          product.useTransaction(trx)

          if (product.stock < item.quantity) {
            throw new Error(`Stock insuficiente para el producto: ${product.name}`)
          }

          product.stock -= item.quantity
          await product.save()

          // Record stock movement
          const movement = new StockMovement()
          movement.fill({
            productId: product.id,
            quantity: item.quantity,
            type: StockMovementType.OUT,
            reason: `Venta #${newSale.receiptNumber || 'N/A'}`,
            performedBy: auth.user!.id,
          })
          movement.useTransaction(trx)
          await movement.save()
        }

        return { newSale, total }
      })

      session.flash(
        'toast',
        JSON.stringify({
          id: randomUUID(),
          message: 'Venta realizada con éxito',
          status: 'success',
        })
      )

      session.flash('latestSale', {
        id: newSale.id,
        total,
        itemsCount: items.reduce(
          (acc: number, item: { quantity: number }) => acc + item.quantity,
          0
        ),
      })

      return response.redirect().back()
    } catch (error) {
      session.flash(
        'toast',
        JSON.stringify({
          id: randomUUID(),
          message: error.message || 'Hubo un error al procesar la venta',
          status: 'error',
        })
      )

      // Also flash errors to trigger Inertia's onError and prevent cart clearing
      session.flashErrors({
        sale: error.message || 'Hubo un error al procesar la venta',
      })

      return response.redirect().back()
    }
  }
}
