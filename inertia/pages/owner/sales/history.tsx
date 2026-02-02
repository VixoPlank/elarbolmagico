import { useState, useCallback } from 'react'
import { Head, router } from '@inertiajs/react'
import OwnerLayout from '@/layouts/owner/owner-layout'
import { urlFor } from '@/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/common/search-bar'
import { Pagination } from '@/components/common/pagination'
import { ShoppingCart } from 'lucide-react'
import { formatCurrencyCLP } from '@/lib/utils'
import { DateTime } from 'luxon'
import SaleDetailsModal from '@/components/owner/sales/sale-details-modal'

interface Sale {
  id: string
  createdAt: string
  receiptNumber: string
  seller: string
  total: number
  paymentMethod: 'CASH' | 'CARD'
}

interface Meta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
  firstPageUrl: string
  lastPageUrl: string
  nextPageUrl: string | null
  previousPageUrl: string | null
}

interface SalesResponse {
  data: Sale[]
  meta: Meta
}

interface Props {
  sales: SalesResponse
  filters: {
    query: string
  }
}

export default function SalesHistory({ sales, filters }: Props) {
  const breadcrumbs = [
    { title: 'Inicio', href: urlFor('dashboard') },
    { title: 'Historial de Ventas' },
  ]
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSaleClick = (saleId: string) => {
    setSelectedSaleId(saleId)
    setIsModalOpen(true)
  }

  const handleSearch = useCallback((query: string) => {
    router.get(urlFor('sales.index'), { query }, { preserveState: true, replace: true })
  }, [])

  const formatDateTime = (dateStr: string) => {
    return DateTime.fromISO(dateStr).toFormat('dd/MM/yyyy HH:mm')
  }

  const getTranslatePayment = (method: string) => {
    return method === 'CASH' ? 'Efectivo' : 'Tarjeta'
  }

  return (
    <OwnerLayout breadcrumbs={breadcrumbs}>
      <Head title="Historial de Ventas" />

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">Historial de Ventas</h1>
              <p className="text-muted-foreground text-sm">
                Consulta y gestiona todas las ventas realizadas.
              </p>
            </div>
            <Button
              className="gap-2 rounded-xl font-bold shadow-sm"
              onClick={() => router.get(urlFor('sales.create'))}
            >
              <ShoppingCart className="h-4 w-4" />
              Nueva Venta
            </Button>
          </div>
          <div className="w-full md:w-72">
            <SearchBar
              placeholder="Buscar ventas..."
              initialValue={filters.query}
              onSearch={handleSearch}
            />
          </div>
        </div>

        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>N° Boleta</TableHead>
                <TableHead className="hidden md:table-cell">Vendedor</TableHead>
                <TableHead className="hidden md:table-cell">Método de Pago</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No se encontraron ventas.
                  </TableCell>
                </TableRow>
              ) : (
                sales.data.map((sale) => (
                  <TableRow
                    key={sale.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSaleClick(sale.id)}
                  >
                    <TableCell className="font-medium">{formatDateTime(sale.createdAt)}</TableCell>
                    <TableCell>
                      <span className="font-mono">#{sale.receiptNumber}</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{sale.seller}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getTranslatePayment(sale.paymentMethod)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrencyCLP(sale.total)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSaleClick(sale.id)
                        }}
                      >
                        Ver detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination
          meta={sales.meta}
          baseUrl={urlFor('sales.index')}
          queryParams={filters}
          className="mt-6"
        />
      </div>

      <SaleDetailsModal
        saleId={selectedSaleId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </OwnerLayout>
  )
}
