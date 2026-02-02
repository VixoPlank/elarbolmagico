import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { Plus } from 'lucide-react'
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

interface AddStockFormProps {
  id: string
  stock: number
  label: string
}

export default function AddStockForm({ id, stock, label }: AddStockFormProps) {
  const [open, setOpen] = useState(false)
  const { data, setData, post, processing, errors, reset } = useForm({
    stock: 0,
    reason: '',
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(urlFor('products.adjustStock', { id }), {
      onSuccess: () => {
        toast.success('Stock actualizado')
        setOpen(false)
        reset()
      },
      onError: () => {
        toast.error('Error al actualizar el stock')
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8 text-green-600">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadiendo stock</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Stock actual:{' '}
            <span className="font-semibold text-foreground">
              {stock} {label}
            </span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad a agregar</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={data.stock}
              onChange={(e) => setData('stock', parseInt(e.target.value))}
              required
            />
            {errors.stock && <p className="text-sm text-destructive">{errors.stock}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo (opcional)</Label>
            <Input
              id="reason"
              placeholder="Ej: Nueva compra, devolución..."
              value={data.reason}
              onChange={(e) => setData('reason', e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={processing}>
              {processing ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
