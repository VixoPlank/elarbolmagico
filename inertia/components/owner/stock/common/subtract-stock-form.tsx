import { useState } from 'react'
import { useForm, router } from '@inertiajs/react'
import { Minus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { urlFor } from '@/client'

interface SubtractStockFormProps {
  id: string
  stock: number
  label: string
}

export default function SubtractStockForm({ id, stock, label }: SubtractStockFormProps) {
  const [open, setOpen] = useState(false)
  const { data, setData, processing, errors, reset } = useForm({
    stock: 0,
    reason: '',
  })

  const newStock = stock - (data.stock || 0)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Enviar como negativo para el ajuste
    router.post(
      urlFor('products.adjustStock', { id }),
      {
        ...data,
        stock: -Math.abs(data.stock),
      },
      {
        onSuccess: () => {
          toast.success('Stock descontado exitosamente')
          setOpen(false)
          reset()
        },
        onError: (err: any) => {
          toast.error(err.error || 'Error al descontar el stock')
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8 text-red-600">
          <Minus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Descontando stock</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Stock actual:{' '}
            <span className="font-semibold text-foreground">
              {stock} {label}
            </span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad a descontar</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={stock}
              value={data.stock}
              onChange={(e) => setData('stock', parseInt(e.target.value))}
              required
            />
            {errors.stock && <p className="text-sm text-destructive">{errors.stock}</p>}
          </div>

          {data.stock > 0 && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm">
                Stock después del descuento:{' '}
                <span
                  className={`font-semibold ${newStock < 5 ? 'text-destructive' : 'text-foreground'}`}
                >
                  {newStock} {label}
                </span>
              </p>
              {newStock < 5 && (
                <p className="mt-1 text-xs text-destructive">⚠️ Stock bajo después del descuento</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo (opcional)</Label>
            <Input
              id="reason"
              placeholder="Ej: Merma, vencimiento, uso interno..."
              value={data.reason}
              onChange={(e) => setData('reason', e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              variant="destructive"
              disabled={processing || data.stock <= 0 || data.stock > stock}
            >
              {processing ? 'Descontando...' : 'Descontar stock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
