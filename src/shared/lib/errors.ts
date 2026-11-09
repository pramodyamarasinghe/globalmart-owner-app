import type { ApiQueryError } from '@/src/api/baseQuery'

/**
 * Message for whatever a query or mutation hands back. Only errors that came through the API layer
 * (they carry a status and a user-safe message) are shown; anything else gets the fallback.
 */
export function errorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'status' in error && 'message' in error) {
    const m = (error as { message?: unknown }).message
    if (typeof m === 'string' && m) return m
  }
  return fallback
}

/** Orders and the catalog exist only on the cloud server; the local server answers 404. */
export function cloudOnlyError(error: ApiQueryError): ApiQueryError {
  return error.status === 404
    ? { ...error, message: 'Orders are not available on this server yet.' }
    : error
}
