import type { HttpContext } from '@adonisjs/core/http'
import Sale from '#models/sale'
import Product from '#models/product'
import { DateTime } from 'luxon'
import { Role } from '#enums/role'

export default class DashboardController {
  async index({ inertia, auth }: HttpContext) {
    if (auth.user?.role !== Role.OWNER) {
      return (inertia.render as any)('dashboard', {})
    }

    const today = DateTime.now()
    const startOfDay = today.startOf('day')
    const endOfDay = today.endOf('day')

    // 1. Ventas de Hoy (Total Amount)
    const salesTodayResult = await Sale.query()
      .whereBetween('createdAt', [startOfDay.toSQL(), endOfDay.toSQL()])
      .sum('total as total')
      .first()

    const salesToday = Number(salesTodayResult?.total || 0)

    // 2. Libros en Stock (Count)
    const booksInStockResult = await Product.query()
      .where('type', 'BOOK')
      .andWhere('stock', '>', 0)
      .count('* as total')
      .first()

    const booksInStock = Number(booksInStockResult?.$extras.total || 0)

    // 3. Productos Varios (Count)
    const otherProductsResult = await Product.query()
      .where('type', 'OTHER')
      .andWhere('stock', '>', 0)
      .count('* as total')
      .first()

    const otherProducts = Number(otherProductsResult?.$extras.total || 0)

    // 4. Última venta (para Actividad Reciente)
    const lastSale = await Sale.query()
      .preload('items', (itemsQuery) => {
        itemsQuery.preload('product')
      })
      .orderBy('createdAt', 'desc')
      .first()

    return (inertia.render as any)('owner/dashboard', {
      stats: {
        salesToday,
        booksInStock,
        otherProducts,
      },
      lastSale: lastSale
        ? {
            id: lastSale.id,
            total: Number(lastSale.total),
            createdAt: lastSale.createdAt.toISO(),
            items: lastSale.items.map((item) => ({
              quantity: Number(item.quantity),
              unitPrice: Number(item.price),
              total: Number(item.quantity) * Number(item.price),
              product: {
                name: item.product.name,
                type: item.product.type,
              },
            })),
          }
        : null,
    })
  }
}
