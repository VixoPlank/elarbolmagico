import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'

export default function InputError({
  message,
  className = '',
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string | string[] }) {
  if (!message) {
    return null
  }

  // Handle both string and array formats (validation errors can be arrays)
  const errorMessage = Array.isArray(message) ? message.join(', ') : message

  return (
    <p {...props} className={cn('text-sm text-red-600 dark:text-red-400', className)}>
      {errorMessage}
    </p>
  )
}
