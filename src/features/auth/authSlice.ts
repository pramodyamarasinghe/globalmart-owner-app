import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request, type Creds } from '@/src/api/http'
import { clearCreds, loadCreds, saveCreds } from './credentialStore'
import { healthSchema, loginSchema, reportListSchema, type LoginInput } from './auth.schemas'

export type AuthState = {
  hydrated: boolean
  connected: boolean
  baseUrl: string
  user: string
  password: string
}

const initialState: AuthState = { hydrated: false, connected: false, baseUrl: '', user: '', password: '' }

export const hydrateAuth = createAsyncThunk('auth/hydrate', loadCreds)

/** Validates the form, proves the login works against the server, then saves it. */
export const connect = createAsyncThunk('auth/connect', async (input: LoginInput): Promise<Creds> => {
  const creds = loginSchema.parse(input)
  await request(creds, { path: '/health', auth: false, schema: healthSchema })
  await request(creds, { path: '/reports', schema: reportListSchema })
  await saveCreds(creds)
  return creds
})

export const logout = createAsyncThunk('auth/logout', clearCreds)

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(hydrateAuth.fulfilled, (s, { payload }) => {
      s.hydrated = true
      s.baseUrl = payload.baseUrl
      s.user = payload.user
      s.password = payload.password
      s.connected = Boolean(payload.baseUrl && payload.user && payload.password)
    })
    b.addCase(hydrateAuth.rejected, (s) => {
      s.hydrated = true
    })
    b.addCase(connect.fulfilled, (s, { payload }) => {
      Object.assign(s, payload, { connected: true })
    })
    b.addCase(logout.fulfilled, (s) => {
      s.connected = false
      s.user = ''
      s.password = ''
    })
  },
})

export const authReducer = slice.reducer
