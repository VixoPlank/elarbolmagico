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

interface Topic {
  id: string
  name: string
}

interface DeleteTopicDialogProps {
  isOpen: boolean
  onClose: () => void
  topic: Topic | null
}

export default function DeleteTopicDialog({ isOpen, onClose, topic }: DeleteTopicDialogProps) {
  const { delete: destroy, processing } = useForm({})

  const handleDelete = () => {
    if (!topic) return

    destroy(urlFor('topics.destroy', { id: topic.id }), {
      onSuccess: () => {
        toast.success('Temática eliminada correctamente')
        onClose()
      },
      onError: (errors: any) => {
        if (errors.error) {
          toast.error(errors.error)
        } else {
          toast.error('Error al intentar eliminar la temática')
        }
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro de eliminar esta temática?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente la temática{' '}
            <span className="font-bold text-foreground">"{topic?.name}"</span>.
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
