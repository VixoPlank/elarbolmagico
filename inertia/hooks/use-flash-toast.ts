import { usePage } from '@inertiajs/react'
import { useEffect, useState, useRef } from 'react'
import { toast } from 'sonner'

/**
 * Hook that handles showing flash messages as toasts.
 * Ensures the component is mounted before showing toasts to avoid SSR hydration issues.
 * Tracks shown toast IDs to prevent duplicate toasts.
 */
export function useFlashToast() {
  const [mounted, setMounted] = useState(false)
  const shownToastIds = useRef<Set<string>>(new Set())
  const page = usePage()
  const { toast: toastData } = page.props as any

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (toastData && toastData.message && toastData.status && toastData.id && mounted) {
      // Only show toast if we haven't shown this ID before
      if (!shownToastIds.current.has(toastData.id)) {
        const toastMethods: Record<string, (message: string | number) => string | number> = {
          success: toast.success,
          error: toast.error,
          warning: toast.warning,
          info: toast.info,
        }
        const method = toastMethods[toastData.status]
        if (method) {
          method(toastData.message)
          shownToastIds.current.add(toastData.id)

          // Clean up old IDs after 5 minutes to prevent memory leak
          // Keep only the last 50 IDs as a safety measure
          if (shownToastIds.current.size > 50) {
            const idsArray = Array.from(shownToastIds.current)
            shownToastIds.current = new Set(idsArray.slice(-50))
          }
        }
      }
    }
  }, [toastData?.id, toastData?.message, toastData?.status, mounted])
}
