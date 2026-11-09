// Plain http is only for the shop network; anything else must be https (the password is sent on every call).
const LAN_HOST = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/

export const SECURE_URL_MESSAGE = 'Use https:// unless the server is on the shop network.'

export function isAllowedServerUrl(url: URL): boolean {
  return url.protocol === 'https:' || (url.protocol === 'http:' && LAN_HOST.test(url.hostname))
}

export function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, '')
}
