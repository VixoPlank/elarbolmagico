import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { urlFor } from '@/client'

interface LowStockAlertSwitchProps {
  checked: boolean
  itemId: string
}

export default function LowStockAlertSwitch({ checked, itemId }: LowStockAlertSwitchProps) {
  const [loading, setLoading] = useState(false)

  const onCheckedChange = (newValue: boolean) => {
    setLoading(true)
    router.patch(
      urlFor('products.update', { id: itemId }),
      {
        lowStockAlert: newValue,
      },
      {
        onSuccess: () => {
          toast.success(`Alerta de stock bajo ${newValue ? 'activada' : 'desactivada'}`)
        },
        onError: () => {
          toast.error('Error al actualizar la alerta')
        },
        onFinish: () => {
          setLoading(false)
        },
        preserveScroll: true,
      }
    )
  }

  return (
    <div className="flex justify-center">
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={loading} />
    </div>
  )
}
