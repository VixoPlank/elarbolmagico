import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatCurrencyCLP } from '@/lib/utils'
import {
  CalendarDays,
  User,
  CreditCard,
  ShoppingBag,
  Banknote,
  Receipt,
  Printer,
  AlertCircle,
} from 'lucide-react'
import { DateTime } from 'luxon'
import { urlFor } from '@/client'

interface SaleItem {
  id: string
  productName: string
  quantity: number
  price: number
  subtotal: number
}

interface SaleDetails {
  id: string
  createdAt: string
  receiptNumber: string
  seller: string
  total: number
  paymentMethod: 'CASH' | 'CARD'
  items: SaleItem[]
}

interface SaleDetailsModalProps {
  saleId: string | null
  isOpen: boolean
  onClose: () => void
}

import { useReceiptPDF } from '@/hooks/use-receipt-pdf'

export default function SaleDetailsModal({ saleId, isOpen, onClose }: SaleDetailsModalProps) {
  const [sale, setSale] = useState<SaleDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { printPDF, isGenerating } = useReceiptPDF()

  useEffect(() => {
    if (saleId && isOpen) {
      setLoading(true)
      setError(null)
      fetch(urlFor('sales.show', { id: saleId }))
        .then((res) => {
          if (!res.ok) throw new Error('Error al cargar detalles')
          return res.json()
        })
        .then((data) => setSale(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    } else {
      setSale(null)
    }
  }, [saleId, isOpen])

  const formatDateTime = (dateStr: string) => {
    return DateTime.fromISO(dateStr).toFormat('dd/MM/yyyy HH:mm')
  }

  const getTranslatePayment = (method: string) => {
    return method === 'CASH' ? 'Efectivo' : 'Tarjeta'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="flex items-center space-x-2">
              <Receipt className="h-6 w-6 text-primary" />
              <span>{loading ? 'Cargando...' : `Venta #${sale?.receiptNumber}`}</span>
            </DialogTitle>

            {sale && !loading && !error && (
              <button
                onClick={() => printPDF(sale)}
                disabled={isGenerating}
                className="flex items-center space-x-2 px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors duration-200 print:hidden disabled:opacity-50"
              >
                <Printer className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {isGenerating ? 'Generando...' : 'Imprimir'}
                </span>
              </button>
            )}
          </div>
        </DialogHeader>

        <div className="mt-4">
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-destructive font-medium">{error}</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground font-medium">Cargando detalles...</p>
            </div>
          )}

          {sale && !loading && !error && (
            <div className="space-y-6">
              {/* Información General */}
              <div className="bg-muted/50 rounded-lg p-4 border grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="font-medium">{formatDateTime(sale.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Vendedor</p>
                    <p className="font-medium">{sale.seller}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 md:col-span-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Método de Pago</p>
                    <p className="font-medium">{getTranslatePayment(sale.paymentMethod)}</p>
                  </div>
                </div>
              </div>

              {/* Lista de Productos */}
              <div className="bg-muted/30 rounded-lg p-4 border">
                <div className="flex items-center space-x-2 mb-4">
                  <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Productos ({sale.items.length})</h3>
                </div>
                <div className="space-y-3">
                  {sale.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold">{item.productName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Cantidad: {item.quantity} unidad
                            {item.quantity > 1 ? 'es' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{formatCurrencyCLP(item.subtotal)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrencyCLP(item.price)} c/u
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-primary/5 rounded-lg p-6 border-2 border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                      <Banknote className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Total de la Venta</h3>
                      <p className="text-sm text-muted-foreground">
                        {sale.items.length} producto
                        {sale.items.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">
                      {formatCurrencyCLP(sale.total)}
                    </p>
                    <p className="text-sm text-primary/80 font-medium">Total Final</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
