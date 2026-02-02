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
import { Plus, Pencil, Trash2, UserCircle } from 'lucide-react'
import AuthorForm from '@/components/owner/authors/author-form'
import DeleteAuthorDialog from '@/components/owner/authors/author-delete-dialog'
import AuthorBooksDrawer from '@/components/owner/authors/author-books-drawer'
import AuthorDetailDrawer from '@/components/owner/authors/author-detail-drawer'
import { Badge } from '@/components/ui/badge'

interface Author {
  id: string
  name: string
  country: string
  bio: string | null
  img: string | null
  createdAt: string
  productsCount: number
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

interface AuthorsResponse {
  data: Author[]
  meta: Meta
}

interface Props {
  authors: AuthorsResponse
  filters: {
    query: string
  }
  selectedAuthor: Author | null
  authorBooks: any | null
}

export default function AuthorsIndex({ authors, filters, authorBooks }: Props) {
  const breadcrumbs = [{ title: 'Inicio', href: urlFor('dashboard') }, { title: 'Autores' }]
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isBooksOpen, setIsBooksOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const handleCreate = () => {
    setSelectedAuthor(null)
    setFormMode('create')
    setIsFormOpen(true)
  }

  const handleEdit = (author: Author) => {
    setSelectedAuthor(author)
    setFormMode('edit')
    setIsFormOpen(true)
  }

  const handleDelete = (author: Author) => {
    setSelectedAuthor(author)
    setIsDeleteOpen(true)
  }

  const handleShowBooks = (author: Author) => {
    setSelectedAuthor(author)
    setIsBooksOpen(true)
  }

  const handleShowDetail = (author: Author) => {
    setSelectedAuthor(author)
    setIsDetailOpen(true)
  }

  return (
    <OwnerLayout breadcrumbs={breadcrumbs}>
      <Head title="Autores" />

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Autores</h1>
            <p className="text-muted-foreground">
              Administra los autores de los libros de la tienda.
            </p>
          </div>
          <Button onClick={handleCreate} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Autor
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-72">
            <SearchBar
              placeholder="Buscar autores o países..."
              initialValue={filters.query}
              baseUrl={urlFor('authors.index')}
            />
          </div>
        </div>

        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Nacionalidad</TableHead>
                <TableHead className="text-center">Libros Publicados</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authors.data.length === 0 ? (
                <TableRow key="empty-row">
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No se encontraron autores.
                  </TableCell>
                </TableRow>
              ) : (
                authors.data.map((author, index) => (
                  <TableRow key={author.id || index}>
                    <TableCell>
                      {author.img ? (
                        <div className="h-10 w-10 overflow-hidden rounded-full border">
                          <img
                            src={author.img}
                            alt={author.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <UserCircle className="h-10 w-10 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <button
                        onClick={() => handleShowDetail(author)}
                        className="hover:text-primary transition-colors cursor-pointer text-left font-bold border-b border-dashed border-transparent hover:border-primary"
                      >
                        {author.name || (
                          <span className="text-destructive font-bold">SIN NOMBRE</span>
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      {author.country || (
                        <span className="text-destructive font-bold">SIN PAÍS</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className="font-semibold cursor-pointer hover:bg-secondary/80 transition-colors"
                        onClick={() => handleShowBooks(author)}
                      >
                        {author.productsCount}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(author)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(author)}
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
          meta={authors.meta}
          baseUrl={urlFor('authors.index')}
          queryParams={filters}
          className="mt-6"
        />
      </div>

      <AuthorForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        author={selectedAuthor}
        mode={formMode}
      />

      <DeleteAuthorDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        author={selectedAuthor}
      />

      <AuthorBooksDrawer
        isOpen={isBooksOpen}
        onClose={() => setIsBooksOpen(false)}
        author={selectedAuthor}
        books={authorBooks}
      />

      <AuthorDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        author={selectedAuthor}
      />
    </OwnerLayout>
  )
}
