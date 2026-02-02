import { useEffect } from 'react'
import { router } from '@inertiajs/react'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Loader2, Book, X } from 'lucide-react'
import { urlFor } from '@/client'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  authorId?: string
}

interface AuthorBooksDrawerProps {
  isOpen: boolean
  onClose: () => void
  author: { id: string; name: string } | null
  books: {
    data: Product[]
    authorId?: string
    meta: {
      currentPage: number
      lastPage: number
      total: number
    }
  } | null
}

export default function AuthorBooksDrawer({
  isOpen,
  onClose,
  author,
  books,
}: AuthorBooksDrawerProps) {
  useEffect(() => {
    if (isOpen && author) {
      const isCorrectAuthor = books && books.authorId === author.id
      if (!isCorrectAuthor) {
        // Load books for the selected author
        router.get(
          urlFor('authors.index'),
          { authorId: author.id, books_page: 1 },
          {
            preserveState: true,
            preserveScroll: true,
            only: ['authorBooks', 'selectedAuthor'],
          }
        )
      }
    }
  }, [isOpen, author, books])

  const onPageChange = (page: number) => {
    if (!author) return
    router.get(
      urlFor('authors.index'),
      { authorId: author.id, books_page: page },
      {
        preserveState: true,
        preserveScroll: true,
        only: ['authorBooks'],
      }
    )
  }

  const handleClose = () => {
    onClose()
    // Clean up URL parameters when closing the drawer
    router.get(
      urlFor('authors.index'),
      {},
      {
        preserveState: true,
        preserveScroll: true,
        only: ['authorBooks', 'selectedAuthor'],
        replace: true,
      }
    )
  }

  const isCorrectAuthor = books && books.authorId === author?.id
  const showLoading = !books || !isCorrectAuthor

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && handleClose()} direction="right">
      <DrawerContent className="h-full w-full sm:max-w-2xl">
        <div className="flex flex-col h-full bg-background">
          <DrawerHeader className="border-b flex flex-row items-center justify-between">
            <div className="text-left">
              <DrawerTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                Catálogo de {author?.name}
              </DrawerTitle>
              <DrawerDescription>Libros registrados para este autor.</DrawerDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {showLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Cargando catálogo...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {books.data.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                            Este autor no tiene libros registrados.
                          </TableCell>
                        </TableRow>
                      ) : (
                        books.data.map((book) => (
                          <TableRow key={book.id}>
                            <TableCell className="font-medium">{book.name}</TableCell>
                            <TableCell className="text-right font-semibold whitespace-nowrap">
                              ${book.price.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right whitespace-nowrap">
                              <span className={book.stock <= 5 ? 'text-destructive font-bold' : ''}>
                                {book.stock}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {books.meta.lastPage > 1 && (
                  <div className="flex items-center justify-between py-4 border-t mt-4">
                    <div className="text-sm text-muted-foreground">
                      Pág. {books.meta.currentPage} / {books.meta.lastPage}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={books.meta.currentPage === 1}
                        onClick={() => onPageChange(books.meta.currentPage - 1)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={books.meta.currentPage === books.meta.lastPage}
                        onClick={() => onPageChange(books.meta.currentPage + 1)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-muted/20">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 px-2">
              <span>Títulos totales:</span>
              <span className="font-bold text-foreground">{books?.meta.total || 0}</span>
            </div>
            <Button variant="outline" className="w-full" onClick={handleClose}>
              Cerrar Panel
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
