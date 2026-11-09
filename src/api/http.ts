import type { z } from 'zod'
import { isAllowedServerUrl, normalizeBaseUrl, SECURE_URL_MESSAGE } from '@/src/shared/lib/url'
import { MESSAGES, messageFromResponse } from './messages'

/** `message` is always safe to show to the user; technical detail only goes to the dev console. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export type Creds = { baseUrl: string; user: string; password: string }

export type HttpRequest<T = unknown> = {
  path: string
  method?: 'GET' | 'POST'
  params?: Record<string, string | number | undefined | null>
  body?: unknown
  /** Validates the response; a mismatch is an ApiError, never bad data in the UI. */
  schema?: z.ZodType<T>
  /** false for public routes such as /health. */
  auth?: boolean
}

function encodeBase64(raw: string): string {
  if (typeof globalThis.btoa === 'function') return globalThis.btoa(raw)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  const bytes = new TextEncoder().encode(raw)
  let out = ''
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i]!
    const b = i + 1 < bytes.length ? bytes[i + 1]! : undefined
    const c = i + 2 < bytes.length ? bytes[i + 2]! : undefined
    out += chars[a >> 2]!
    out += chars[((a & 3) << 4) | ((b ?? 0) >> 4)]!
    out += b === undefined ? '=' : chars[(((b ?? 0) & 15) << 2) | ((c ?? 0) >> 6)]!
    out += c === undefined ? '=' : chars[(c ?? 0) & 63]!
  }
  return out
}

function buildUrl(creds: Creds, req: HttpRequest<unknown>): URL {
  if (!creds.baseUrl) throw new ApiError(MESSAGES.notConnected, 0)
  let url: URL
  try {
    url = new URL(`${normalizeBaseUrl(creds.baseUrl)}${req.path}`)
  } catch {
    throw new ApiError(MESSAGES.badAddress, 0)
  }
  if (!isAllowedServerUrl(url)) throw new ApiError(SECURE_URL_MESSAGE, 0)
  for (const [k, v] of Object.entries(req.params ?? {})) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
  }
  return url
}

async function readBody(res: Response): Promise<unknown> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

/** The one place that talks to the report API: auth header, https rule, error mapping, response validation. */
export async function request<T>(
  creds: Creds,
  req: HttpRequest<T>,
  signal?: AbortSignal
): Promise<T> {
  const url = buildUrl(creds, req)
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (req.auth !== false) {
    headers.Authorization = `Basic ${encodeBase64(`${creds.user}:${creds.password}`)}`
  }
  if (req.body !== undefined) headers['Content-Type'] = 'application/json'

  let res: Response
  try {
    res = await fetch(url.toString(), {
      method: req.method ?? 'GET',
      headers,
      body: req.body === undefined ? undefined : JSON.stringify(req.body),
      signal,
    })
  } catch (e) {
    if (__DEV__) console.warn('[api] network error', e)
    throw new ApiError(MESSAGES.offline, 0)
  }

  const body = await readBody(res)
  if (!res.ok) {
    if (__DEV__) console.warn(`[api] ${res.status} ${req.path}`, body)
    throw new ApiError(messageFromResponse(res.status, body), res.status)
  }

  if (!req.schema) return body as T
  const parsed = req.schema.safeParse(body)
  if (!parsed.success) {
    if (__DEV__) console.warn(`[api] unexpected response from ${req.path}`, parsed.error.issues)
    throw new ApiError(MESSAGES.unreadable, res.status)
  }
  return parsed.data
}
