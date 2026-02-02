import { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'

/**
 * Toast action configuration
 */
export interface ToastAction {
  label: string
  url: string
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete'
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    /**
     * Show a toast message with status and message string
     * @param status - The status type (success, error, warning, info)
     * @param message - The message string to display
     * @param options - Optional configuration for the toast
     * @param options.action - Action button configuration (label, url, method)
     * @returns void
     */
    toast(
      status: 'success' | 'error' | 'warning' | 'info',
      message: string,
      options?: {
        action?: ToastAction
      }
    ): void
  }
}

/**
 * Extend HttpContext with toast helper
 */
HttpContext.macro(
  'toast',
  function (
    this: HttpContext,
    status: 'success' | 'error' | 'warning' | 'info',
    message: string,
    options?: { action?: ToastAction }
  ) {
    if (!this || !this.session) {
      throw new Error(
        'Toast macro called without proper HttpContext. Ensure session middleware is registered and the method is called within a controller action.'
      )
    }

    const id = randomUUID()

    // Store as JSON string with all fields
    const toastData = JSON.stringify({
      status,
      message,
      id,
      action: options?.action || null,
    })

    this.session.flash('toast', toastData)
  }
)
