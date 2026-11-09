/** Plain-language text for every way a call can fail. Nothing here comes from a stack trace, status line or validation detail. */
export const MESSAGES = {
  offline: 'We could not reach the server. Check your connection and try again.',
  notConnected: 'You are not signed in. Please sign in to continue.',
  badAddress: 'That server address does not look right. Please check it.',
  unauthorized: 'Your username or password is not right. Please sign in again.',
  tooMany: 'Too many attempts. Please wait a few minutes and try again.',
  notReady: 'The shop data is still loading. Please try again in a minute.',
  notFound: 'We could not find what you asked for.',
  badRequest: 'That could not be done. Please check what you entered and try again.',
  server: 'Something went wrong on our side. Please try again in a moment.',
  unreadable: 'We could not read the answer from the server. Please try again, or update the app.',
  generic: 'Something went wrong. Please try again.',
} as const

function messageForStatus(status: number): string {
  if (status === 401) return MESSAGES.unauthorized
  if (status === 404) return MESSAGES.notFound
  if (status === 429) return MESSAGES.tooMany
  if (status === 503) return MESSAGES.notReady
  if (status >= 500) return MESSAGES.server
  if (status >= 400) return MESSAGES.badRequest
  return MESSAGES.generic
}

/**
 * The report API sends `{ code, message }` with a message written for the shop owner, so that is
 * used when present. Older servers fall back to the status. The raw `error` text and validation
 * `issues` are never shown.
 */
export function messageFromResponse(status: number, body: unknown): string {
  if (body && typeof body === 'object') {
    const b = body as { code?: unknown; message?: unknown }
    if (typeof b.code === 'string' && typeof b.message === 'string' && b.message) return b.message
  }
  return messageForStatus(status)
}
