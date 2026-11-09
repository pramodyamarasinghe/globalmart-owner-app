import * as SecureStore from 'expo-secure-store'
import type { Creds } from '@/src/api/http'

const KEY_BASE = 'gm.baseUrl'
const KEY_USER = 'gm.user'
const KEY_PASS = 'gm.password'

export async function loadCreds(): Promise<Creds> {
  return {
    baseUrl: (await SecureStore.getItemAsync(KEY_BASE)) ?? '',
    user: (await SecureStore.getItemAsync(KEY_USER)) ?? '',
    password: (await SecureStore.getItemAsync(KEY_PASS)) ?? '',
  }
}

export async function saveCreds(c: Creds): Promise<void> {
  await SecureStore.setItemAsync(KEY_BASE, c.baseUrl)
  await SecureStore.setItemAsync(KEY_USER, c.user)
  await SecureStore.setItemAsync(KEY_PASS, c.password)
}

/** Logging out forgets the user and password but keeps the server URL for the next login. */
export async function clearCreds(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY_USER)
  await SecureStore.deleteItemAsync(KEY_PASS)
}
