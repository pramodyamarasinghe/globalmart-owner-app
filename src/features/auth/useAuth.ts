import { useState, useTransition } from 'react'
import { useAppDispatch, useAppSelector } from '@/src/store/hooks'
import { REQUIRED_MESSAGE, loginSchema } from './auth.schemas'
import { connect, logout } from './authSlice'

export function useAuth() {
  const dispatch = useAppDispatch()
  const connected = useAppSelector((s) => s.auth.connected)
  return { connected, logout: () => void dispatch(logout()) }
}

/** Login form: validates with zod before touching the network, then connects. */
export function useLoginForm() {
  const dispatch = useAppDispatch()
  const savedBase = useAppSelector((s) => s.auth.baseUrl)
  const savedUser = useAppSelector((s) => s.auth.user)
  const [baseUrl, setBaseUrl] = useState(savedBase || 'http://192.168.8.142:4100')
  const [user, setUser] = useState(savedUser || '')
  const [password, setPassword] = useState('')
  // An async transition: `busy` is true until the connect call settles, with no manual set/reset.
  const [busy, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function submit() {
    setError(null)
    const parsed = loginSchema.safeParse({ baseUrl, user, password })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? REQUIRED_MESSAGE)
      return
    }
    startTransition(async () => {
      try {
        await dispatch(connect(parsed.data)).unwrap()
      } catch (e) {
        // Only errors that came through the API layer carry text meant for the user.
        const err = e as { name?: string; message?: string }
        const message = err.name === 'ApiError' ? err.message : undefined
        startTransition(() => setError(message || 'Sign in failed. Check your details and try again.'))
      }
    })
  }

  return { baseUrl, setBaseUrl, user, setUser, password, setPassword, busy, error, submit }
}
