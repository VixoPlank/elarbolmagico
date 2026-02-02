import { Head } from '@inertiajs/react'
import OwnerLayout from '@/layouts/owner/owner-layout'
import { urlFor } from '@/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag, DollarSign, Star, Clock } from 'lucide-react'
import { formatCurrencyCLP } from '@/lib/utils'
import { TopProductsChart } from '@/components/owner/reports/top-products-chart'
import { SalesEvolutionChart } from '@/components/owner/reports/sales-evolution-chart'

interface Stats {
  totalSales: number
  totalAmount: number
  topProduct: {
    name: string
    quantity: number
  } | null
  lastSale: {
    date: string
    time: string
  } | null
}

interface Product {
  name: string
  quantity: number
}

interface DailySale {
  day: number
  sales: number
  amount: number
}

interface SalesEvolution {
  data: DailySale[]
  selectedMonth: string
  selectedYear: number
  availableMonths: Array<{ value: string; label: string }>
}

interface Props {
  stats: Stats
  topBooks: Product[]
  topOthers: Product[]
  salesEvolution: SalesEvolution
}

export default function ReportsIndex({ stats, topBooks, topOthers, salesEvolution }: Props) {
  const breadcrumbs = [{ title: 'Inicio', href: urlFor('dashboard') }, { title: 'Reportes' }]

  return (
    <OwnerLayout breadcrumbs={breadcrumbs}>
      <Head title="Reportes" />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Resumen del mes actual 📊</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total de ventas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de ventas</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSales}</div>
            </CardContent>
          </Card>

          {/* Monto total vendido */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monto total vendido</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrencyCLP(stats.totalAmount)}</div>
            </CardContent>
          </Card>

          {/* Producto más vendido */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Producto más vendido</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate" title={stats.topProduct?.name || 'N/A'}>
                {stats.topProduct?.name || 'N/A'}
              </div>
              {stats.topProduct && (
                <p className="text-xs text-muted-foreground">
                  {stats.topProduct.quantity} vendidos
                </p>
              )}
            </CardContent>
          </Card>

          {/* Última venta */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Última venta</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {stats.lastSale ? (
                <>
                  <div className="text-2xl font-bold">{stats.lastSale.date}</div>
                  <p className="text-xs text-muted-foreground">{stats.lastSale.time}</p>
                </>
              ) : (
                <div className="text-2xl font-bold">N/A</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Evolución de Ventas */}
        <SalesEvolutionChart
          data={salesEvolution.data}
          selectedMonth={salesEvolution.selectedMonth}
          selectedYear={salesEvolution.selectedYear}
          availableMonths={salesEvolution.availableMonths}
        />

        {/* Gráficos de Top Productos */}
        <div className="grid gap-4 md:grid-cols-2">
          <TopProductsChart title="Top 3 Libros Más Vendidos" data={topBooks} color="#3b82f6" />
          <TopProductsChart
            title="Top 3 Otros Productos Más Vendidos"
            data={topOthers}
            color="#10b981"
          />
        </div>
      </div>
    </OwnerLayout>
  )
}
