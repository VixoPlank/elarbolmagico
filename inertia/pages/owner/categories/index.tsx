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
import CategoryForm from '@/components/owner/categories/category-form'
import DeleteCategoryDialog from '@/components/owner/categories/category-delete-dialog'

interface Category {
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

interface CategoriesResponse {
  data: Category[]
  meta: Meta
}

interface Props {
  categories: CategoriesResponse
  filters: {
    query: string
  }
}

export default function CategoriesIndex({ categories, filters }: Props) {
  const breadcrumbs = [{ title: 'Inicio', href: urlFor('dashboard') }, { title: 'Categorías' }]
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const handleCreate = () => {
    setSelectedCategory(null)
    setFormMode('create')
    setIsFormOpen(true)
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setFormMode('edit')
    setIsFormOpen(true)
  }

  const handleDelete = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteOpen(true)
  }

  const formatDate = (dateStr: string) => {
    return DateTime.fromISO(dateStr).toFormat('dd/MM/yyyy HH:mm')
  }

  return (
    <OwnerLayout breadcrumbs={breadcrumbs}>
      <Head title="Categorías" />

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Categorías</h1>
            <p className="text-muted-foreground">
              Administra las categorías de productos de la tienda.
            </p>
          </div>
          <Button onClick={handleCreate} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Categoría
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-72">
            <SearchBar
              placeholder="Buscar categorías..."
              initialValue={filters.query}
              baseUrl={urlFor('categories.index')}
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
              {categories.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                    No se encontraron categorías.
                  </TableCell>
                </TableRow>
              ) : (
                categories.data.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{formatDate(category.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category)}
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
          meta={categories.meta}
          baseUrl={urlFor('categories.index')}
          queryParams={filters}
          className="mt-6"
        />
      </div>

      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        category={selectedCategory}
        mode={formMode}
      />

      <DeleteCategoryDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        category={selectedCategory}
      />
    </OwnerLayout>
  )
}
