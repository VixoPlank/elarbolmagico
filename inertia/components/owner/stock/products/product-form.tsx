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

interface ProductFormProps {
  product?: any
  categories: any[]
  brands: any[]
  mode: 'create' | 'edit'
}

export default function ProductForm({ product, categories, brands, mode }: ProductFormProps) {
  const [open, setOpen] = useState(false)
  const { data, setData, post, patch, processing, errors, reset } = useForm({
    name: product?.name || '',
    barCode: product?.barCode || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    type: product?.type || ProductType.OTHER,
    categoryId: product?.categoryId || '',
    brandId: product?.brandId || '',
    img: product?.img || '',
  })

  useEffect(() => {
    if (product && mode === 'edit') {
      setData({
        name: product.name || '',
        barCode: product.barCode || '',
        price: product.price || 0,
        stock: product.stock || 0,
        type: product.type || ProductType.OTHER,
        categoryId: product.categoryId || '',
        brandId: product.brandId || '',
        img: product.img || '',
      })
    }
  }, [product, mode])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'create') {
      post(urlFor('products.store'), {
        onSuccess: () => {
          toast.success('Producto creado exitosamente')
          setOpen(false)
          reset()
        },
      })
    } else {
      patch(urlFor('products.update', { id: product.id }), {
        onSuccess: () => {
          toast.success('Producto actualizado')
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
            <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Nuevo Producto' : 'Editar Producto'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                required
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="barCode">Código de Barras</Label>
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
              <Label>Categoría</Label>
              <SearchableSelect
                items={categories.map((c: any) => ({ value: c.id.toString(), label: c.name }))}
                value={data.categoryId?.toString()}
                onValueChange={(v) => setData('categoryId', v)}
                placeholder="Selecciona categoría"
                emptyMessage="No se encontraron categorías."
              />
            </div>

            <div className="space-y-2">
              <Label>Marca</Label>
              <SearchableSelect
                items={brands.map((b: any) => ({ value: b.id.toString(), label: b.name }))}
                value={data.brandId?.toString()}
                onValueChange={(v) => setData('brandId', v)}
                placeholder="Selecciona marca"
                emptyMessage="No se encontraron marcas."
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
              {processing
                ? 'Guardando...'
                : mode === 'create'
                  ? 'Crear Producto'
                  : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
