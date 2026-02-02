import { useCallback } from 'react'

export function useInitials() {
  return useCallback((name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [])
}
