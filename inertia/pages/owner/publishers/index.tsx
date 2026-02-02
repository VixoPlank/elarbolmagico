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
import PublisherForm from '@/components/owner/publishers/publisher-form'
import DeletePublisherDialog from '@/components/owner/publishers/publisher-delete-dialog'

interface Publisher {
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

interface PublishersResponse {
  data: Publisher[]
  meta: Meta
}

interface Props {
  publishers: PublishersResponse
  filters: {
    query: string
  }
}

export default function PublishersIndex({ publishers, filters }: Props) {
  const breadcrumbs = [{ title: 'Inicio', href: urlFor('dashboard') }, { title: 'Editoriales' }]
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const handleCreate = () => {
    setSelectedPublisher(null)
    setFormMode('create')
    setIsFormOpen(true)
  }

  const handleEdit = (publisher: Publisher) => {
    setSelectedPublisher(publisher)
    setFormMode('edit')
    setIsFormOpen(true)
  }

  const handleDelete = (publisher: Publisher) => {
    setSelectedPublisher(publisher)
    setIsDeleteOpen(true)
  }

  const formatDate = (dateStr: string) => {
    return DateTime.fromISO(dateStr).toFormat('dd/MM/yyyy HH:mm')
  }

  return (
    <OwnerLayout breadcrumbs={breadcrumbs}>
      <Head title="Editoriales" />

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Editoriales</h1>
            <p className="text-muted-foreground">
              Administra las editoriales de los libros de la tienda.
            </p>
          </div>
          <Button onClick={handleCreate} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Editorial
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-72">
            <SearchBar
              placeholder="Buscar editoriales..."
              initialValue={filters.query}
              baseUrl={urlFor('publishers.index')}
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
              {publishers.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                    No se encontraron editoriales.
                  </TableCell>
                </TableRow>
              ) : (
                publishers.data.map((publisher) => (
                  <TableRow key={publisher.id}>
                    <TableCell className="font-medium">{publisher.name}</TableCell>
                    <TableCell>{formatDate(publisher.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(publisher)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(publisher)}
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
          meta={publishers.meta}
          baseUrl={urlFor('publishers.index')}
          queryParams={filters}
          className="mt-6"
        />
      </div>

      <PublisherForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        publisher={selectedPublisher}
        mode={formMode}
      />

      <DeletePublisherDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        publisher={selectedPublisher}
      />
    </OwnerLayout>
  )
}
