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

interface Brand {
  id: string
  name: string
}

interface DeleteBrandDialogProps {
  isOpen: boolean
  onClose: () => void
  brand: Brand | null
}

export default function DeleteBrandDialog({ isOpen, onClose, brand }: DeleteBrandDialogProps) {
  const { delete: destroy, processing } = useForm({})

  const handleDelete = () => {
    if (!brand) return

    destroy(urlFor('brands.destroy', { id: brand.id }), {
      onSuccess: () => {
        toast.success('Marca eliminada correctamente')
        onClose()
      },
      onError: (errors: any) => {
        if (errors.error) {
          toast.error(errors.error)
        } else {
          toast.error('Error al intentar eliminar la marca')
        }
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro de eliminar esta marca?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente la marca{' '}
            <span className="font-bold text-foreground">"{brand?.name}"</span>.
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
