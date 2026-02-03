import app from '@adonisjs/core/services/app'
import { type HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import type { StatusPageRange, StatusPageRenderer } from '@adonisjs/core/types/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * Status pages are used to display a custom HTML pages for certain error
   * codes. You might want to enable them in production only, but feel
   * free to enable them in development as well.
   */
  protected renderStatusPages = app.inProduction

  /**
   * Status pages is a collection of error code range and a callback
   * to return the HTML contents to send as a response.
   */
  protected statusPages: Record<StatusPageRange, StatusPageRenderer> = {
    '404': (error, { inertia }) => {
      if (inertia) return inertia.render('errors/not_found', { error })
      return '404 Not Found'
    },
    '500..599': (error, { inertia }) => {
      if (inertia) return inertia.render('errors/server_error', { error })
      return '500 Server Error'
    },
  }

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    // Check if this is an API request
    const isApiRequest = ctx.request.url().startsWith('/api')

    if (isApiRequest) {
      // Handle API errors with JSON responses
      const err = error as any

      if (err.code === 'E_VALIDATION_FAILURE') {
        const errors: Record<string, string[]> = {}
        if (err.messages) {
          for (const [field, messages] of Object.entries(err.messages)) {
            errors[field] = Array.isArray(messages) ? messages : [messages as string]
          }
        }
        return ctx.response.status(422).json({
          message: 'Validation failed',
          errors,
        })
      }

      if (err.code === 'E_ROW_NOT_FOUND') {
        return ctx.response.status(404).json({
          message: 'Resource not found',
        })
      }

      // Default API error response
      const status = err.status || err.statusCode || 500
      return ctx.response.status(status).json({
        message: err.message || 'Internal server error',
        ...(this.debug && err.stack && { stack: err.stack }),
      })
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
