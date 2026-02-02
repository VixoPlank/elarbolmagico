import { Head } from '@inertiajs/react'
import { urlFor } from '@/client'
import AppLayout from '@/layouts/app-layout'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pagination } from '@/components/common/pagination'
import { Plus, Package, Barcode as BarcodeIcon, Tag, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/store/cart-store'
import { toast } from 'sonner'
import { ScannerSearchBar } from '@/components/owner/sales/scanner-search-bar'
import { CartSummary } from '@/components/owner/sales/cart-summary'
import { cn } from '@/lib/utils'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  barCode: string | null
  type: string
}

interface Props {
  products: {
    data: Product[]
    meta: any
  }
  filters: {
    query: string
  }
}

export default function SellPage({ products, filters }: Props) {
  const breadcrumbs = [{ title: 'Inicio', href: urlFor('dashboard') }, { title: 'Punto de Venta' }]
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error('Sin stock disponible')
      return
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
    })
    toast.success(`${product.name} agregado al carrito`, {
      icon: <ShoppingCart className="h-4 w-4" />,
      duration: 2000,
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Punto de Venta" />

      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
              <Package className="h-10 w-10 text-primary" />
              Punto de Venta
            </h1>
            <p className="text-muted-foreground text-lg">
              Busca productos y gestiona ventas rápidamente.
            </p>
          </div>
          <CartSummary />
        </div>

        {/* Search Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          <div className="md:col-span-3">
            <ScannerSearchBar
              initialValue={filters.query}
              placeholder="Escanea un código de barras o escribe el nombre del producto..."
            />
          </div>
          <div className="bg-card rounded-2xl border p-4 flex items-center justify-between shadow-sm h-12">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Tag className="h-5 w-5" />
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                  Resultados:
                </p>
                <p className="text-xl font-black leading-none">{products?.meta?.total || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-card rounded-3xl border shadow-xl overflow-hidden transition-all">
          <Table>
            <TableHeader className="bg-muted/50 h-16">
              <TableRow className="hover:bg-transparent border-b-2">
                <TableHead className="pl-6 font-bold text-foreground">Producto</TableHead>
                <TableHead className="font-bold text-foreground">Código</TableHead>
                <TableHead className="font-bold text-foreground text-right">Precio</TableHead>
                <TableHead className="font-bold text-foreground text-center">Stock</TableHead>
                <TableHead className="pr-6 font-bold text-foreground text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!products?.data || products.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 opacity-40">
                      <Package className="h-16 w-16" />
                      <p className="text-xl font-bold">No se encontraron productos</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.data.map((product) => (
                  <TableRow
                    key={product.id}
                    className="h-20 hover:bg-muted/30 transition-colors group"
                  >
                    <TableCell className="pl-6">
                      <div className="flex flex-col">
                        <span className="font-black text-lg group-hover:text-primary transition-colors">
                          {product.name}
                        </span>
                        <Badge variant="outline" className="w-fit text-[10px] h-5 font-bold mt-1">
                          {product.type === 'BOOK' ? 'LIBRO' : 'OTRO'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground font-mono font-medium">
                        <BarcodeIcon className="h-4 w-4" />
                        {product.barCode || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-lg font-black font-mono">
                      ${product.price.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={cn(
                            'text-lg font-black',
                            product.stock <= 5 ? 'text-destructive' : 'text-foreground'
                          )}
                        >
                          {product.stock}
                        </span>
                        {product.stock <= 5 && (
                          <span className="text-[10px] font-bold text-destructive animate-pulse">
                            ¡BAJO STOCK!
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        className={cn(
                          'h-12 w-12 rounded-xl shadow-md transition-all active:scale-90',
                          product.stock > 0
                            ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        <Plus className="h-6 w-6" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Section */}
        {products?.meta && (
          <div className="flex justify-center pb-10">
            <Pagination
              meta={products.meta}
              baseUrl={urlFor('sales.create')}
              queryParams={filters}
            />
          </div>
        )}
      </div>
    </AppLayout>
  )
}
