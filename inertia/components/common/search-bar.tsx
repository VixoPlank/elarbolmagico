import { useState, useEffect, useRef } from 'react'
import { router } from '@inertiajs/react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  placeholder?: string
  baseUrl?: string
  initialValue?: string
  className?: string
  only?: string[]
  onSearch?: (query: string) => void
}

export function SearchBar({
  placeholder = 'Buscar...',
  baseUrl,
  initialValue = '',
  className,
  only,
  onSearch,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // Don't search if the search term hasn't changed from the initial value
    // This prevents re-triggering search when paginating or when the component re-renders
    if (searchTerm === initialValue) {
      return
    }

    const delayDebounceFn = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm)
      } else if (baseUrl) {
        router.get(
          baseUrl,
          { query: searchTerm, page: 1 },
          {
            preserveState: true,
            replace: true,
            preserveScroll: true,
            ...(only ? { only } : {}),
          }
        )
      }
    }, 400)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, baseUrl, onSearch, only, initialValue])

  // Sincronizar con props externas si cambian
  useEffect(() => {
    setSearchTerm(initialValue)
  }, [initialValue])

  const clearSearch = () => {
    setSearchTerm('')
  }

  return (
    <div className={cn('relative w-full max-w-md', className)}>
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-8 pr-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <button
          onClick={clearSearch}
          className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
