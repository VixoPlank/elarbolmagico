import { Head, router } from '@inertiajs/react'
import OwnerLayout from '@/layouts/owner/owner-layout'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatCurrencyCLP } from '@/lib/utils'
import { urlFor } from '@/client'
import { Trash2 } from 'lucide-react'
import AddStockForm from '@/components/owner/stock/common/add-stock-form'
import SubtractStockForm from '@/components/owner/stock/common/subtract-stock-form'
import LowStockAlertSwitch from '@/components/owner/stock/common/low-stock-alert-switch'
import BookForm from '@/components/owner/stock/books/book-form'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { SearchBar } from '@/components/common/search-bar'
import { Pagination } from '@/components/common/pagination'

interface Props {
  products: any
  authors: any[]
  publishers: any[]
  topics: any[]
  filters: {
    query: string
  }
}

export default function BooksPage({ products, authors, publishers, topics, filters }: Props) {
  const breadcrumbs = [
    { title: 'Inicio', href: urlFor('dashboard') },
    { title: 'Stock', href: urlFor('stock.index') },
    { title: 'Libros' },
  ]

  const handleDelete = (id: string) => {
    router.delete(urlFor('products.destroy', { id }), {
      onSuccess: () => toast.success('Libro eliminado'),
      onError: () => toast.error('Error al eliminar el libro'),
    })
  }

  const getStockVariant = (stock: number) => {
    if (stock <= 5) return 'destructive'
    if (stock <= 20) return 'secondary'
    return 'default'
  }

  return (
    <OwnerLayout breadcrumbs={breadcrumbs}>
      <Head title="Inventario de Libros" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Libros</h1>
          <BookForm mode="create" authors={authors} publishers={publishers} topics={topics} />
        </div>

        <div className="flex justify-between items-center gap-4 flex-col sm:flex-row">
          <SearchBar
            baseUrl={urlFor('stock.books')}
            placeholder="Buscar por libro, autor o ISBN..."
            initialValue={filters.query}
          />
        </div>

        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-center">Alerta</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Editorial</TableHead>
                <TableHead>ISBN</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.data.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium max-w-[200px] truncate" title={product.name}>
                    {product.name}
                  </TableCell>
                  <TableCell>{formatCurrencyCLP(product.price)}</TableCell>
                  <TableCell>
                    <Badge variant={getStockVariant(product.stock) as any}>{product.stock}</Badge>
                  </TableCell>
                  <TableCell>
                    <LowStockAlertSwitch checked={product.lowStockAlert} itemId={product.id} />
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {product.author?.name || '-'}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {product.publisher?.name || '-'}
                  </TableCell>
                  <TableCell>{product.barCode || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      <AddStockForm id={product.id} stock={product.stock} label="unidades" />
                      <SubtractStockForm id={product.id} stock={product.stock} label="unidades" />
                      <BookForm
                        mode="edit"
                        book={product}
                        authors={authors}
                        publishers={publishers}
                        topics={topics}
                      />

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente el
                              libro "{product.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(product.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {products.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No se encontraron libros.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination meta={products.meta} baseUrl={urlFor('stock.books')} queryParams={filters} />
      </div>
    </OwnerLayout>
  )
}
