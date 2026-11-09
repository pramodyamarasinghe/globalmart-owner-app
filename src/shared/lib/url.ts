// Plain http is only for the shop network; anything else must be https (the password is sent on every call).
function isLanHost(host: string): boolean {
  if (host === 'localhost') return true
  const parts = host.split('.')
  if (parts.length !== 4 || !parts.every((p) => /^\d{1,3}$/.test(p) && Number(p) <= 255)) return false
  const [a = -1, b = -1] = parts.map(Number)
  return a === 127 || a === 10 || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31)
}

export const SECURE_URL_MESSAGE = 'Use https:// unless the server is on the shop network.'

export function isAllowedServerUrl(url: URL): boolean {
  return url.protocol === 'https:' || (url.protocol === 'http:' && isLanHost(url.hostname))
}

export function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, '')
}
