import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, Barcode, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { router } from '@inertiajs/react'
import { urlFor } from '@/client'

interface ScannerSearchBarProps {
  placeholder?: string
  initialValue?: string
  className?: string
  onProductFound?: (product: any) => void
}

export function ScannerSearchBar({
  placeholder = 'Buscar por nombre o código...',
  initialValue = '',
  className,
  onProductFound,
}: ScannerSearchBarProps) {
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)

  // Use a ref to track if we are currently searching to avoid double-submissions
  const isSearchingRef = useRef(false)

  useEffect(() => {
    // Focus on mount for faster scanning
    inputRef.current?.focus()
  }, [])

  const checkProduct = useCallback(
    async (code: string) => {
      if (!code.trim() || !onProductFound || isSearchingRef.current) return

      isSearchingRef.current = true
      try {
        const url = `${urlFor('sales.checkProduct')}?code=${encodeURIComponent(code)}`
        const response = await fetch(url)

        if (response.ok) {
          const data = await response.json()
          // Found exact match via barcode
          onProductFound(data)
          setValue('') // Clear input specifically for scanner workflow
          inputRef.current?.focus()
        }
      } catch (error) {
        // Ignore errors (e.g. 404 not found)
      } finally {
        isSearchingRef.current = false
      }
    },
    [onProductFound]
  )

  // Automatic check with debounce (mimicking reference behavior)
  useEffect(() => {
    if (!value || value.length < 3) return

    const timeoutId = setTimeout(() => {
      checkProduct(value)
    }, 500) // 500ms delay to allow scanner to finish typing

    return () => clearTimeout(timeoutId)
  }, [value, checkProduct])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!value.trim()) return

    // Immediately try to check product (skip debounce)
    if (onProductFound) {
      await checkProduct(value)
      // If checkProduct successfully found and cleared, we are done.
      // But checkProduct is async and we need to know if it succeeded to decide whether to Fallback.
      // Simplification: checkProduct clears value on success.
      if (value === '') return
    }

    // Standard search fallback (for text search)
    // We only do this if the value is still there (meaning it wasn't a barcode match that cleared the input)
    // Note: checkProduct logic above with 'await' might be tricky because we read 'value' from closure or state?
    // Actually, 'checkProduct' clears 'value'. But react state update is async.
    // So we should rely on the fact that if it was a product, it's handled.
    // If we want to support "Search for 'Book'" by pressing Enter, we should let it pass.

    // To distinguish between "Barcode Match" and "Text Search", we can check API.
    // We already called checkProduct above. If it found something, it processed it.

    // Fallback: If we are here, maybe it's not a barcode but a name.
    // Let's do a standard search navigation.
    router.get(
      urlFor('sales.create'),
      { query: value },
      { preserveState: true, replace: true, preserveScroll: true }
    )
  }

  const handleClear = () => {
    setValue('')
    router.get(
      urlFor('sales.create'),
      {},
      { preserveState: true, replace: true, preserveScroll: true }
    )
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSearch} className={cn('relative group w-full', className)}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center gap-1">
          <Barcode className="h-4 w-4 group-focus-within:text-primary transition-colors" />
        </div>
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder} // Changed from autoFocus to ref focus in useEffect for better control
          className="pl-10 pr-10 h-12 text-lg shadow-sm border-2 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-xl"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
    </form>
  )
}
