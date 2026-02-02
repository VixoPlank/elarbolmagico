import type { HttpContext } from '@adonisjs/core/http'
import Sale from '#models/sale'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

export default class ReportsController {
  async index({ inertia, request }: HttpContext) {
    // Get month and year from query params for the chart
    const queryMonth = request.input('month')
    const queryYear = request.input('year')

    const now = DateTime.now()

    // Current month for stats (always current)
    const currentMonthStart = now.startOf('month')
    const currentMonthEnd = now.endOf('month')

    // Selected month for chart (can be different)
    const selectedDate =
      queryMonth && queryYear
        ? DateTime.fromObject({ year: parseInt(queryYear), month: parseInt(queryMonth) })
        : now

    const selectedMonthStart = selectedDate.startOf('month')
    const selectedMonthEnd = selectedDate.endOf('month')

    // Total de ventas y monto total (CURRENT MONTH ONLY)
    const salesStats = await Sale.query()
      .whereBetween('createdAt', [currentMonthStart.toSQL(), currentMonthEnd.toSQL()])
      .count('* as total')
      .sum('total as totalAmount')
      .first()

    // Producto más vendido (CURRENT MONTH ONLY)
    const topProductResult = await db
      .from('sale_items')
      .join('sales', 'sale_items.sale_id', 'sales.id')
      .join('products', 'sale_items.product_id', 'products.id')
      .whereBetween('sales.created_at', [currentMonthStart.toSQL(), currentMonthEnd.toSQL()])
      .select('products.name as productName')
      .sum('sale_items.quantity as totalQuantity')
      .groupBy('products.name')
      .orderBy('totalQuantity', 'desc')
      .first()

    // Top 3 Libros más vendidos (CURRENT MONTH ONLY)
    const topBooks = await db
      .from('sale_items')
      .join('sales', 'sale_items.sale_id', 'sales.id')
      .join('products', 'sale_items.product_id', 'products.id')
      .whereBetween('sales.created_at', [currentMonthStart.toSQL(), currentMonthEnd.toSQL()])
      .where('products.type', 'BOOK')
      .select('products.name as productName')
      .sum('sale_items.quantity as totalQuantity')
      .groupBy('products.name')
      .orderBy('totalQuantity', 'desc')
      .limit(3)

    // Top 3 Otros Productos más vendidos (CURRENT MONTH ONLY)
    const topOthers = await db
      .from('sale_items')
      .join('sales', 'sale_items.sale_id', 'sales.id')
      .join('products', 'sale_items.product_id', 'products.id')
      .whereBetween('sales.created_at', [currentMonthStart.toSQL(), currentMonthEnd.toSQL()])
      .where('products.type', 'OTHER')
      .select('products.name as productName')
      .sum('sale_items.quantity as totalQuantity')
      .groupBy('products.name')
      .orderBy('totalQuantity', 'desc')
      .limit(3)

    // Evolución de ventas diarias (SELECTED MONTH - can be different)
    const dailySalesRaw = await db
      .from('sales')
      .whereBetween('created_at', [selectedMonthStart.toSQL()!, selectedMonthEnd.toSQL()!])
      .select(db.raw('EXTRACT(DAY FROM created_at)::integer as day'))
      .count('* as sales')
      .sum('total as amount')
      .groupByRaw('EXTRACT(DAY FROM created_at)')
      .orderBy('day', 'asc')

    // Fill in missing days with zero sales
    const daysInMonth = selectedDate.daysInMonth ?? 0
    const dailySales = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1
      const found = dailySalesRaw.find((d) => d.day === day)
      return {
        day,
        sales: found ? Number(found.sales) : 0,
        amount: found ? Number(found.amount) : 0,
      }
    })

    // Generate available months (last 12 months)
    const availableMonths = Array.from({ length: 12 }, (_, i) => {
      const date = now.minus({ months: i })
      return {
        value: `${date.year}-${date.month}`,
        label: date.toFormat('MMMM yyyy', { locale: 'es' }),
      }
    })

    // Última venta (global, not month-specific)
    const lastSale = await Sale.query().orderBy('createdAt', 'desc').first()

    return (inertia.render as any)('owner/reports/index', {
      stats: {
        totalSales: Number(salesStats?.total || 0),
        totalAmount: Number(salesStats?.$extras.totalAmount || 0),
        topProduct: topProductResult
          ? {
              name: topProductResult.productName,
              quantity: Number(topProductResult.totalQuantity),
            }
          : null,
        lastSale: lastSale
          ? {
              date: lastSale.createdAt.toFormat('dd MMMM yyyy'),
              time: lastSale.createdAt.toFormat('HH:mm'),
            }
          : null,
      },
      topBooks: topBooks.map((item) => ({
        name: item.productName,
        quantity: Number(item.totalQuantity),
      })),
      topOthers: topOthers.map((item) => ({
        name: item.productName,
        quantity: Number(item.totalQuantity),
      })),
      salesEvolution: {
        data: dailySales,
        selectedMonth: selectedDate.month.toString(),
        selectedYear: selectedDate.year,
        availableMonths,
      },
    })
  }
}
