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

interface Publisher {
  id: string
  name: string
}

interface DeletePublisherDialogProps {
  isOpen: boolean
  onClose: () => void
  publisher: Publisher | null
}

export default function DeletePublisherDialog({
  isOpen,
  onClose,
  publisher,
}: DeletePublisherDialogProps) {
  const { delete: destroy, processing } = useForm({})

  const handleDelete = () => {
    if (!publisher) return

    destroy(urlFor('publishers.destroy', { id: publisher.id }), {
      onSuccess: () => {
        toast.success('Editorial eliminada correctamente')
        onClose()
      },
      onError: (errors: any) => {
        if (errors.error) {
          toast.error(errors.error)
        } else {
          toast.error('Error al intentar eliminar la editorial')
        }
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro de eliminar esta editorial?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente la editorial{' '}
            <span className="font-bold text-foreground">"{publisher?.name}"</span>.
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
