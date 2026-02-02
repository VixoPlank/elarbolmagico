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
import { Textarea } from '@/components/ui/textarea'
import { SearchableSelect } from '@/components/common/searchable-select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { COUNTRIES } from '@/data/countries'
import { urlFor } from '@/client'

interface Author {
  id: string
  name: string
  country: string
  bio: string | null
  img: string | null
}

interface AuthorFormProps {
  isOpen: boolean
  onClose: () => void
  author: Author | null
  mode: 'create' | 'edit'
}

export default function AuthorForm({ isOpen, onClose, author, mode }: AuthorFormProps) {
  const isEditMode = mode === 'edit'

  const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
    name: '',
    country: '',
    bio: '',
    img: '',
  })

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && author) {
        setData({
          name: author.name,
          country: author.country,
          bio: author.bio || '',
          img: author.img || '',
        })
      } else {
        reset()
      }
      clearErrors()
    }
  }, [isOpen, author, mode])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditMode && author) {
      patch(urlFor('authors.update', { id: author.id }), {
        onSuccess: () => {
          toast.success('Autor actualizado correctamente')
          onClose()
        },
      })
    } else {
      post(urlFor('authors.store'), {
        onSuccess: () => {
          toast.success('Autor creado correctamente')
          onClose()
        },
      })
    }
  }

  const countryItems = COUNTRIES.map((c) => ({
    value: c.name,
    label: c.name,
  }))

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Editar Autor' : 'Nuevo Autor'}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? 'Modifica la información del autor seleccionado.'
                : 'Ingresa los datos para registrar un nuevo autor.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Ej: Gabriel García Márquez"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label>Nacionalidad</Label>
              <SearchableSelect
                items={countryItems}
                value={data.country}
                onValueChange={(v) => setData('country', v)}
                placeholder="Selecciona un país"
                emptyMessage="No se encontró el país."
              />
              {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="img">URL de la Foto (Opcional)</Label>
              <div className="flex gap-3 items-center">
                <Input
                  id="img"
                  value={data.img}
                  onChange={(e) => setData('img', e.target.value)}
                  placeholder="https://..."
                />
                {data.img && (
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border">
                    <img src={data.img} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
              {errors.img && <p className="text-sm text-destructive">{errors.img}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Biografía (Opcional)</Label>
              <Textarea
                id="bio"
                value={data.bio}
                onChange={(e) => setData('bio', e.target.value)}
                placeholder="Escribe una breve biografía..."
                rows={4}
              />
              {errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
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
