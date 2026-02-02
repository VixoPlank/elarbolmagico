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

interface Publisher {
  id: string
  name: string
}

interface PublisherFormProps {
  isOpen: boolean
  onClose: () => void
  publisher: Publisher | null
  mode: 'create' | 'edit'
}

export default function PublisherForm({ isOpen, onClose, publisher, mode }: PublisherFormProps) {
  const isEditMode = mode === 'edit'

  const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
    name: '',
  })

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && publisher) {
        setData('name', publisher.name)
      } else {
        reset()
      }
      clearErrors()
    }
  }, [isOpen, publisher, mode])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditMode && publisher) {
      patch(urlFor('publishers.update', { id: publisher.id }), {
        onSuccess: () => {
          toast.success('Editorial actualizada correctamente')
          onClose()
        },
      })
    } else {
      post(urlFor('publishers.store'), {
        onSuccess: () => {
          toast.success('Editorial creada correctamente')
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
            <DialogTitle>{isEditMode ? 'Editar Editorial' : 'Nueva Editorial'}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? 'Modifica el nombre de la editorial seleccionada.'
                : 'Ingresa el nombre para la nueva editorial.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Ej: Alfaguara, Planeta..."
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
