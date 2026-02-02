import { useForm } from '@inertiajs/react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { urlFor } from '@/client'

interface Author {
  id: string
  name: string
}

interface DeleteAuthorDialogProps {
  isOpen: boolean
  onClose: () => void
  author: Author | null
}

export default function DeleteAuthorDialog({ isOpen, onClose, author }: DeleteAuthorDialogProps) {
  const { delete: destroy, processing } = useForm({})

  const handleDelete = () => {
    if (!author) return

    destroy(urlFor('authors.destroy', { id: author.id }), {
      onSuccess: () => {
        toast.success('Autor eliminado correctamente')
        onClose()
      },
      onError: (errors: any) => {
        if (errors.error) {
          toast.error(errors.error)
        } else {
          toast.error('Error al intentar eliminar el autor')
        }
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro de eliminar este autor?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente al autor{' '}
            <span className="font-bold text-foreground">"{author?.name}"</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={processing}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={processing}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
