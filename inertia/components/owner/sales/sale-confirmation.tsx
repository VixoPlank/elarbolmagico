import { useState } from 'react'
import { useReceiptPDF } from '@/hooks/use-receipt-pdf'
import { toast } from 'sonner'
import { Printer, CheckCircle } from 'lucide-react'
import { formatCurrencyCLP } from '@/lib/utils'
import { urlFor } from '@/client'
import { SaleDetails } from '@/components/common/receipt-pdf'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface SaleConfirmationProps {
  saleId: string
  total: number
  itemsCount: number
  onClose: () => void
}

export default function SaleConfirmation({
  saleId,
  total,
  itemsCount,
  onClose,
}: SaleConfirmationProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { printPDF } = useReceiptPDF()

  const handleGenerateReceipt = async () => {
    if (!saleId) {
      toast.error('No hay ID de venta válido')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch(urlFor('sales.show', { id: saleId }))
      if (!response.ok) throw new Error('Error al obtener detalles de la venta')

      const saleDetails: SaleDetails = await response.json()

      await printPDF(saleDetails)
      toast.success('Comprobante generado e impreso exitosamente')
    } catch (error) {
      console.error('Error generando comprobante:', error)
      toast.error('Error al generar el comprobante')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <DialogTitle className="text-2xl font-black text-center">¡Venta Completada!</DialogTitle>
          <DialogDescription className="text-center text-base">
            La venta se ha procesado exitosamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-muted/50 rounded-xl p-6 border border-border">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 text-center">
              Resumen
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-3 bg-background rounded-lg shadow-sm border">
                <span className="text-xs font-semibold text-muted-foreground mb-1">Total</span>
                <span className="text-xl font-black text-primary">{formatCurrencyCLP(total)}</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-background rounded-lg shadow-sm border">
                <span className="text-xs font-semibold text-muted-foreground mb-1">Productos</span>
                <span className="text-xl font-black text-foreground">
                  {itemsCount} {itemsCount === 1 ? 'u.' : 'u.'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex gap-3 items-start">
            <Printer className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">
                Imprimir Comprobante
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-500 font-medium leading-relaxed">
                Formato optimizado para impresoras térmicas de 58mm.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-3">
          <Button
            size="lg"
            className="w-full font-bold text-base shadow-lg shadow-primary/20"
            onClick={handleGenerateReceipt}
            disabled={isGenerating}
          >
            <Printer className="mr-2 h-5 w-5" />
            {isGenerating ? 'Generando...' : 'Imprimir Boleta'}
          </Button>
          <Button variant="outline" size="lg" className="w-full" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
