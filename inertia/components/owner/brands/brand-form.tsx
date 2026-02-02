import { useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { urlFor } from '@/client'

interface Brand {
  id: string
  name: string
}

interface BrandFormProps {
  isOpen: boolean
  onClose: () => void
  brand: Brand | null
  mode: 'create' | 'edit'
}

export default function BrandForm({ isOpen, onClose, brand, mode }: BrandFormProps) {
  const isEditMode = mode === 'edit'

  const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
    name: '',
  })

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && brand) {
        setData('name', brand.name)
      } else {
        reset()
      }
      clearErrors()
    }
  }, [isOpen, brand, mode])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditMode && brand) {
      patch(urlFor('brands.update', { id: brand.id }), {
        onSuccess: () => {
          toast.success('Marca actualizada correctamente')
          onClose()
        },
      })
    } else {
      post(urlFor('brands.store'), {
        onSuccess: () => {
          toast.success('Marca creada correctamente')
          onClose()
        },
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Editar Marca' : 'Nueva Marca'}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? 'Modifica el nombre de la marca seleccionada.'
                : 'Ingresa el nombre para la nueva marca.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Ej: Pilot, Pentel..."
                className={errors.name ? 'border-destructive' : ''}
                autoFocus
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
              Cancelar
            </Button>
            <Button type="submit" disabled={processing}>
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
