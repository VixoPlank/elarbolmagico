import { useState } from 'react'
import { Head } from '@inertiajs/react'
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
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { DateTime } from 'luxon'
import BrandForm from '@/components/owner/brands/brand-form'
import DeleteBrandDialog from '@/components/owner/brands/brand-delete-dialog'

interface Brand {
  id: string
  name: string
  createdAt: string
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

interface BrandsResponse {
  data: Brand[]
  meta: Meta
}

interface Props {
  brands: BrandsResponse
  filters: {
    query: string
  }
}

export default function BrandsIndex({ brands, filters }: Props) {
  const breadcrumbs = [{ title: 'Inicio', href: urlFor('dashboard') }, { title: 'Marcas' }]
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const handleCreate = () => {
    setSelectedBrand(null)
    setFormMode('create')
    setIsFormOpen(true)
  }

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand)
    setFormMode('edit')
    setIsFormOpen(true)
  }

  const handleDelete = (brand: Brand) => {
    setSelectedBrand(brand)
    setIsDeleteOpen(true)
  }

  const formatDate = (dateStr: string) => {
    return DateTime.fromISO(dateStr).toFormat('dd/MM/yyyy HH:mm')
  }

  return (
    <OwnerLayout breadcrumbs={breadcrumbs}>
      <Head title="Marcas" />

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Marcas</h1>
            <p className="text-muted-foreground">
              Administra las marcas de productos de la tienda.
            </p>
          </div>
          <Button onClick={handleCreate} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Marca
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-72">
            <SearchBar
              placeholder="Buscar marcas..."
              initialValue={filters.query}
              baseUrl={urlFor('brands.index')}
            />
          </div>
        </div>

        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Fecha de Creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                    No se encontraron marcas.
                  </TableCell>
                </TableRow>
              ) : (
                brands.data.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell className="font-medium">{brand.name}</TableCell>
                    <TableCell>{formatDate(brand.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(brand)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(brand)}
                          title="Eliminar"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination
          meta={brands.meta}
          baseUrl={urlFor('brands.index')}
          queryParams={filters}
          className="mt-6"
        />
      </div>

      <BrandForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        brand={selectedBrand}
        mode={formMode}
      />

      <DeleteBrandDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        brand={selectedBrand}
      />
    </OwnerLayout>
  )
}
