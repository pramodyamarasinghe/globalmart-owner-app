import * as SecureStore from 'expo-secure-store'
import { create } from 'zustand'
import { probeConnection, setApiSession, type SessionCreds } from '@/src/api/client'

const KEY_BASE = 'gm.baseUrl'
const KEY_USER = 'gm.user'
const KEY_PASS = 'gm.password'

type SessionState = {
  hydrated: boolean
  connected: boolean
  baseUrl: string
  user: string
  password: string
  hydrate: () => Promise<void>
  connect: (creds: SessionCreds) => Promise<void>
  saveSettings: (creds: SessionCreds) => Promise<void>
  logout: () => Promise<void>
}

async function persist(creds: SessionCreds): Promise<void> {
  await SecureStore.setItemAsync(KEY_BASE, creds.baseUrl.trim().replace(/\/+$/, ''))
  await SecureStore.setItemAsync(KEY_USER, creds.user)
  await SecureStore.setItemAsync(KEY_PASS, creds.password)
}

async function clearPersist(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY_BASE)
  await SecureStore.deleteItemAsync(KEY_USER)
  await SecureStore.deleteItemAsync(KEY_PASS)
}

export const useSession = create<SessionState>((set, get) => ({
  hydrated: false,
  connected: false,
  baseUrl: '',
  user: '',
  password: '',

  hydrate: async () => {
    const baseUrl = (await SecureStore.getItemAsync(KEY_BASE)) ?? ''
    const user = (await SecureStore.getItemAsync(KEY_USER)) ?? ''
    const password = (await SecureStore.getItemAsync(KEY_PASS)) ?? ''
    if (baseUrl && user && password) {
      const creds = { baseUrl, user, password }
      setApiSession(creds)
      set({ baseUrl, user, password, connected: true, hydrated: true })
      return
    }
    setApiSession(null)
    set({ baseUrl, user, password: '', connected: false, hydrated: true })
  },

  connect: async (creds) => {
    const normalized = {
      baseUrl: creds.baseUrl.trim().replace(/\/+$/, ''),
      user: creds.user.trim(),
      password: creds.password,
    }
    await probeConnection(normalized)
    await persist(normalized)
    setApiSession(normalized)
    set({ ...normalized, connected: true })
  },

  saveSettings: async (creds) => {
    const normalized = {
      baseUrl: creds.baseUrl.trim().replace(/\/+$/, ''),
      user: creds.user.trim(),
      password: creds.password || get().password,
    }
    await probeConnection(normalized)
    await persist(normalized)
    setApiSession(normalized)
    set({ ...normalized, connected: true })
  },

  logout: async () => {
    await clearPersist()
    setApiSession(null)
    set({ connected: false, user: '', password: '', baseUrl: get().baseUrl })
  },
}))
