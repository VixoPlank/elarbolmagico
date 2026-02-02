import { Head } from '@inertiajs/react'
import OwnerLayout from '@/layouts/owner/owner-layout'
import { urlFor } from '@/client'
import {
  TrendingUp,
  ShoppingCart,
  Package,
  ArrowRight,
  BookOpen,
  DollarSign,
  History,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { router, usePage } from '@inertiajs/react'
import { formatCurrencyCLP } from '@/lib/utils'
import { DateTime } from 'luxon'

interface Stats {
  salesToday: number
  booksInStock: number
  otherProducts: number
}

interface Product {
  name: string
  type: 'BOOK' | 'OTHER'
}

interface SaleItem {
  quantity: number
  unitPrice: number
  total: number
  product: Product
}

interface LastSale {
  id: string
  total: number
  createdAt: string
  items: SaleItem[]
}

interface Props {
  stats: Stats
  lastSale: LastSale | null
}

export default function OwnerDashboard({ stats: data, lastSale }: Props) {
  const { user } = usePage().props as any
  const stats = [
    {
      title: 'Ventas de Hoy',
      value: formatCurrencyCLP(data.salesToday),
      description: 'Total acumulado hoy',
      icon: DollarSign,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Libros en Stock',
      value: data.booksInStock.toString(),
      description: 'Total de ejemplares',
      icon: BookOpen,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Productos Varios',
      value: data.otherProducts.toString(),
      description: 'Artículos de regalo/papelería',
      icon: Package,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  ]

  const quickActions = [
    {
      title: 'Realizar Venta',
      description: 'Abrir el punto de venta (POS)',
      icon: ShoppingCart,
      href: urlFor('sales.create'),
      variant: 'default' as const,
    },
    {
      title: 'Ver Historial',
      description: 'Listado de ventas pasadas',
      icon: History,
      href: urlFor('sales.index'),
      variant: 'outline' as const,
    },
    {
      title: 'Gestionar Stock',
      description: 'Inventario y reposición',
      icon: Package,
      href: urlFor('stock.index'),
      variant: 'outline' as const,
    },
  ]

  const breadcrumbs = [{ title: 'Inicio' }]

  return (
    <OwnerLayout breadcrumbs={breadcrumbs}>
      <Head title="Panel de Administración" />

      <div className="space-y-10 pb-10">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
              ¡Hola, {user.firstName}! 👋
            </h1>
            <p className="text-muted-foreground text-lg italic">
              "Un libro es un regalo que puedes abrir una y otra vez."
            </p>
          </div>
          <Button
            size="lg"
            className="h-14 px-8 rounded-2xl text-lg font-bold shadow-xl transition-all hover:scale-105 active:scale-95 bg-primary hover:bg-primary/90"
            onClick={() => router.get(urlFor('sales.create'))}
          >
            <ShoppingCart className="mr-2 h-6 w-6" />
            Nueva Venta
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="border-none shadow-md hover:shadow-xl transition-all rounded-3xl overflow-hidden group"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-colors group-hover:scale-110 duration-300`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <TrendingUp className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-black text-foreground">{stat.value}</h3>
                  <p className="text-xs text-muted-foreground font-medium">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-black flex items-center gap-2 px-1">Acciones Rápidas</h2>
            <div className="space-y-4">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  variant={action.variant}
                  className={`w-full h-24 justify-start p-6 rounded-3xl border-2 transition-all hover:border-primary group ${
                    action.variant === 'default'
                      ? 'shadow-lg shadow-primary/20 hover:scale-[1.02]'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => router.get(action.href)}
                >
                  <div
                    className={`p-3 rounded-2xl transition-all ${
                      action.variant === 'default'
                        ? 'bg-primary-foreground/10 text-primary-foreground'
                        : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                    }`}
                  >
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4 text-left">
                    <p className="font-black text-lg leading-tight">{action.title}</p>
                    <p
                      className={`text-sm font-medium ${
                        action.variant === 'default' ? 'opacity-80' : 'text-muted-foreground'
                      }`}
                    >
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight
                    className={`ml-auto h-5 w-5 transition-transform group-hover:translate-x-1 ${
                      action.variant === 'default' ? 'opacity-60' : 'text-muted-foreground/40'
                    }`}
                  />
                </Button>
              ))}
            </div>
          </div>

          {/* Activity / Latest Sale */}
          <Card className="lg:col-span-2 border-none shadow-md rounded-3xl bg-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center justify-between">
                <span>Última Venta</span>
                {lastSale && (
                  <span className="text-sm font-normal text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {DateTime.fromISO(lastSale.createdAt)
                      .setLocale('es')
                      .toFormat("d 'de' MMMM, t")}
                  </span>
                )}
              </CardTitle>
              <CardDescription>Detalles de la transacción más reciente</CardDescription>
            </CardHeader>
            <CardContent>
              {lastSale ? (
                <div className="space-y-6">
                  {/* Total and ID */}
                  <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <div>
                      <p className="text-sm text-emerald-600 font-bold uppercase tracking-wider mb-1">
                        Total Venta
                      </p>
                      <p className="text-4xl font-black text-emerald-700">
                        {formatCurrencyCLP(lastSale.total)}
                      </p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">
                      Productos Vendidos
                    </p>
                    <div className="space-y-3">
                      {lastSale.items &&
                        lastSale.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center shadow-sm">
                                {item.product.type === 'BOOK' ? (
                                  <BookOpen className="h-5 w-5 text-blue-500" />
                                ) : (
                                  <Package className="h-5 w-5 text-amber-500" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-foreground">{item.product.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.quantity} x {formatCurrencyCLP(item.unitPrice)}
                                </p>
                              </div>
                            </div>
                            <p className="font-bold text-foreground">
                              {formatCurrencyCLP(item.total)}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground space-y-3">
                  <div className="p-4 bg-background rounded-full shadow-inner">
                    <History className="h-8 w-8 opacity-20" />
                  </div>
                  <p className="font-medium italic">Aún no se han registrado ventas.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </OwnerLayout>
  )
}
