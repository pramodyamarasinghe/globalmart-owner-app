import { z } from 'zod'
import { isAllowedServerUrl, normalizeBaseUrl, SECURE_URL_MESSAGE } from '@/src/shared/lib/url'

export const healthSchema = z.object({
  ok: z.boolean(),
  snapshotAgeSeconds: z.number().int().nullable().optional(),
})

export const reportListSchema = z.object({ reports: z.array(z.string()) })

export const REQUIRED_MESSAGE = 'Please fill in server, username, and password.'

const serverUrl = z
  .string()
  .transform(normalizeBaseUrl)
  .pipe(z.string().min(1, REQUIRED_MESSAGE))
  .refine((v) => URL.canParse(v), 'Enter a valid server URL.')
  .refine((v) => !URL.canParse(v) || isAllowedServerUrl(new URL(v)), SECURE_URL_MESSAGE)

/** What the login form may submit. */
export const loginSchema = z.object({
  baseUrl: serverUrl,
  user: z.string().trim().min(1, REQUIRED_MESSAGE),
  password: z.string().min(1, REQUIRED_MESSAGE),
})

export type LoginInput = z.infer<typeof loginSchema>
