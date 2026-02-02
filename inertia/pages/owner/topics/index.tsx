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
import TopicForm from '@/components/owner/topics/topic-form'
import DeleteTopicDialog from '@/components/owner/topics/topic-delete-dialog'

interface Topic {
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

interface TopicsResponse {
  data: Topic[]
  meta: Meta
}

interface Props {
  topics: TopicsResponse
  filters: {
    query: string
  }
}

export default function TopicsIndex({ topics, filters }: Props) {
  const breadcrumbs = [{ title: 'Inicio', href: urlFor('dashboard') }, { title: 'Temáticas' }]
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const handleCreate = () => {
    setSelectedTopic(null)
    setFormMode('create')
    setIsFormOpen(true)
  }

  const handleEdit = (topic: Topic) => {
    setSelectedTopic(topic)
    setFormMode('edit')
    setIsFormOpen(true)
  }

  const handleDelete = (topic: Topic) => {
    setSelectedTopic(topic)
    setIsDeleteOpen(true)
  }

  const formatDate = (dateStr: string) => {
    return DateTime.fromISO(dateStr).toFormat('dd/MM/yyyy HH:mm')
  }

  return (
    <OwnerLayout breadcrumbs={breadcrumbs}>
      <Head title="Temáticas" />

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Temáticas</h1>
            <p className="text-muted-foreground">
              Administra las temáticas de los libros de la tienda.
            </p>
          </div>
          <Button onClick={handleCreate} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Temática
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-72">
            <SearchBar
              placeholder="Buscar temáticas..."
              initialValue={filters.query}
              baseUrl={urlFor('topics.index')}
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
              {topics.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                    No se encontraron temáticas.
                  </TableCell>
                </TableRow>
              ) : (
                topics.data.map((topic) => (
                  <TableRow key={topic.id}>
                    <TableCell className="font-medium">{topic.name}</TableCell>
                    <TableCell>{formatDate(topic.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(topic)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(topic)}
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
          meta={topics.meta}
          baseUrl={urlFor('topics.index')}
          queryParams={filters}
          className="mt-6"
        />
      </div>

      <TopicForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        topic={selectedTopic}
        mode={formMode}
      />

      <DeleteTopicDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        topic={selectedTopic}
      />
    </OwnerLayout>
  )
}
