export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export type SessionCreds = {
  baseUrl: string
  user: string
  password: string
}

let session: SessionCreds | null = null
let onUnauthorized: (() => void) | null = null

export function setApiSession(next: SessionCreds | null): void {
  session = next
}

export function getApiSession(): SessionCreds | null {
  return session
}

export function setOnUnauthorized(handler: (() => void) | null): void {
  onUnauthorized = handler
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

function basicHeader(user: string, password: string): string {
  return `Basic ${encodeBase64(`${user}:${password}`)}`
}

function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, '')
}

export async function apiFetch<T>(
  path: string,
  opts: {
    method?: string
    query?: Record<string, string | number | undefined | null>
    auth?: boolean
    creds?: SessionCreds
    signal?: AbortSignal
  } = {}
): Promise<T> {
  const creds = opts.creds ?? session
  if (!creds?.baseUrl) throw new ApiError('Not connected. Set the server URL in Settings.', 0)

  const url = new URL(path.startsWith('http') ? path : `${normalizeBaseUrl(creds.baseUrl)}${path}`)
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
    }
  }

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (opts.auth !== false) {
    headers.Authorization = basicHeader(creds.user, creds.password)
  }

  let res: Response
  try {
    res = await fetch(url.toString(), {
      method: opts.method ?? 'GET',
      headers,
      signal: opts.signal,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error'
    throw new ApiError(
      `Cannot reach server. Check the URL and that the report API is running on the shop network. (${msg})`,
      0
    )
  }

  const text = await res.text()
  let body: unknown = null
  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      body = text
    }
  }

  if (res.status === 401) {
    onUnauthorized?.()
    throw new ApiError('Unauthorized. Check username and password.', 401, body)
  }

  if (!res.ok) {
    const errObj = body as { error?: string; issues?: unknown } | null
    const detail =
      errObj && typeof errObj === 'object' && typeof errObj.error === 'string'
        ? errObj.error
        : `Request failed (${res.status})`
    throw new ApiError(detail, res.status, body)
  }

  return body as T
}

export async function probeConnection(creds: SessionCreds): Promise<void> {
  await apiFetch<{ ok: boolean }>('/health', { auth: false, creds })
  await apiFetch<{ reports: string[] }>('/reports', { creds })
}
