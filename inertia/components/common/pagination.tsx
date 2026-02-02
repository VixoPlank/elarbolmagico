import { router } from '@inertiajs/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  meta: {
    currentPage: number
    lastPage: number
    total: number
    perPage: number
  }
  baseUrl?: string
  queryParams?: Record<string, any>
  className?: string
}

export function Pagination({ meta, baseUrl, queryParams = {}, className }: PaginationProps) {
  if (meta.total === 0) return null

  const onPageChange = (page: number) => {
    if (!baseUrl) return

    // Filter out empty, null or undefined values from queryParams
    const filteredParams = Object.entries(queryParams).reduce(
      (acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value
        }
        return acc
      },
      {} as Record<string, any>
    )

    router.get(baseUrl, { ...filteredParams, page }, { preserveState: true, preserveScroll: true })
  }

  return (
    <div className={cn('flex items-center justify-between w-full py-4', className)}>
      <div className="text-sm text-muted-foreground">
        Mostrando <span className="font-medium">{(meta.currentPage - 1) * meta.perPage + 1}</span> a{' '}
        <span className="font-medium">{Math.min(meta.currentPage * meta.perPage, meta.total)}</span>{' '}
        de <span className="font-medium">{meta.total}</span> resultados
      </div>
      {meta.lastPage > 1 && (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(meta.currentPage - 1)}
            disabled={meta.currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(meta.currentPage + 1)}
            disabled={meta.currentPage >= meta.lastPage}
          >
            Siguiente
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}
