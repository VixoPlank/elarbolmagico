import { useState, useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import { Plus, Pencil } from 'lucide-react'
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
import { SearchableSelect } from '@/components/common/searchable-select'
import { toast } from 'sonner'
import { ProductType } from '#enums/product'
import { urlFor } from '@/client'

interface BookFormProps {
  book?: any
  authors: any[]
  publishers: any[]
  topics: any[]
  mode: 'create' | 'edit'
}

export default function BookForm({ book, authors, publishers, topics, mode }: BookFormProps) {
  const [open, setOpen] = useState(false)
  const { data, setData, post, patch, processing, errors, reset } = useForm({
    name: book?.name || '',
    barCode: book?.barCode || '',
    price: book?.price || 0,
    stock: book?.stock || 0,
    type: ProductType.BOOK,
    authorId: book?.authorId || '',
    publisherId: book?.publisherId || '',
    topicId: book?.topicId || '',
    img: book?.img || '',
  })

  // Sincronizar con el libro si cambia (para el modo edit)
  useEffect(() => {
    if (book && mode === 'edit') {
      setData({
        name: book.name || '',
        barCode: book.barCode || '',
        price: book.price || 0,
        stock: book.stock || 0,
        type: ProductType.BOOK,
        authorId: book.authorId || '',
        publisherId: book.publisherId || '',
        topicId: book.topicId || '',
        img: book.img || '',
      })
    }
  }, [book, mode])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'create') {
      post(urlFor('products.store'), {
        onSuccess: () => {
          toast.success('Libro creado exitosamente')
          setOpen(false)
          reset()
        },
      })
    } else {
      patch(urlFor('products.update', { id: book.id }), {
        onSuccess: () => {
          toast.success('Libro actualizado')
          setOpen(false)
        },
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === 'create' ? (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Libro
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Nuevo Libro' : 'Editar Libro'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name">Título</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                required
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="barCode">ISBN / Código de Barras</Label>
              <Input
                id="barCode"
                value={data.barCode}
                onChange={(e) => setData('barCode', e.target.value)}
              />
              {errors.barCode && <p className="text-sm text-destructive">{errors.barCode}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                type="number"
                value={data.price}
                onChange={(e) => setData('price', parseInt(e.target.value))}
                required
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
            </div>

            {mode === 'create' && (
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Inicial</Label>
                <Input
                  id="stock"
                  type="number"
                  value={data.stock}
                  onChange={(e) => setData('stock', parseInt(e.target.value))}
                  required
                />
                {errors.stock && <p className="text-sm text-destructive">{errors.stock}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label>Autor</Label>
              <SearchableSelect
                items={authors.map((a: any) => ({ value: a.id.toString(), label: a.name }))}
                value={data.authorId?.toString()}
                onValueChange={(v) => setData('authorId', v)}
                placeholder="Selecciona un autor"
                emptyMessage="No se encontraron autores."
              />
            </div>

            <div className="space-y-2">
              <Label>Editorial</Label>
              <SearchableSelect
                items={publishers.map((p: any) => ({ value: p.id.toString(), label: p.name }))}
                value={data.publisherId?.toString()}
                onValueChange={(v) => setData('publisherId', v)}
                placeholder="Selecciona una editorial"
                emptyMessage="No se encontraron editoriales."
              />
            </div>

            <div className="space-y-2">
              <Label>Temática</Label>
              <SearchableSelect
                items={topics.map((t: any) => ({ value: t.id.toString(), label: t.name }))}
                value={data.topicId?.toString()}
                onValueChange={(v) => setData('topicId', v)}
                placeholder="Selecciona una temática"
                emptyMessage="No se encontraron temáticas."
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="img">URL de Imagen</Label>
              <div className="flex gap-2">
                <Input
                  id="img"
                  value={data.img}
                  onChange={(e) => setData('img', e.target.value)}
                  placeholder="https://..."
                />
                {data.img && (
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded border">
                    <img src={data.img} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={processing} className="w-full">
              {processing ? 'Guardando...' : mode === 'create' ? 'Crear Libro' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
