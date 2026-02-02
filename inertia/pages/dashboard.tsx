import { Head, router } from '@inertiajs/react'
import { urlFor } from '@/client'
import AppLayout from '@/layouts/app-layout'
import { ShoppingCart, Package, History, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const breadcrumbs = [{ title: 'Inicio' }]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Panel de Trabajo" />

      <div className="space-y-10 pb-10 max-w-5xl mx-auto">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
              Bienvenido al Árbol Mágico 🌳
            </h1>
            <p className="text-muted-foreground text-lg italic">"Donde los libros cobran vida."</p>
          </div>
        </div>

        {/* Hero Sell Action */}
        <Card className="border-none bg-primary text-primary-foreground shadow-2xl rounded-[2.5rem] overflow-hidden group">
          <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 -rotate-12 translate-x-10 -translate-y-10 group-hover:translate-x-5 transition-transform duration-700">
              <ShoppingCart size={240} />
            </div>

            <div className="space-y-4 relative z-10 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black leading-tight">
                ¿Listo para una
                <br />
                nueva venta?
              </h2>
              <p className="text-primary-foreground/80 text-lg font-medium">
                Escanea productos y procesa pagos al instante.
              </p>
            </div>

            <Button
              size="lg"
              className="h-20 px-10 rounded-3xl text-2xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95 bg-white text-primary hover:bg-white/90 relative z-10"
              onClick={() => router.get(urlFor('sales.create'))}
            >
              Comenzar Venta
              <ArrowRight className="ml-3 h-8 w-8" />
            </Button>
          </CardContent>
        </Card>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className="border-none shadow-md hover:shadow-lg transition-all rounded-3xl cursor-pointer group"
            onClick={() => router.get(urlFor('sales.index'))}
          >
            <CardContent className="p-8 flex items-center gap-6">
              <div className="p-4 bg-muted rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <History className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Historial</h3>
                <p className="text-muted-foreground">Ventas realizadas anteriormente</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-none shadow-md hover:shadow-lg transition-all rounded-3xl cursor-pointer group"
            onClick={() => router.get(urlFor('stock.index'))}
          >
            <CardContent className="p-8 flex items-center gap-6">
              <div className="p-4 bg-muted rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Package className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Consultar Stock</h3>
                <p className="text-muted-foreground">Ver disponibilidad de libros</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
