import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as SecureStore from 'expo-secure-store'
import { darkColors, lightColors, type ThemeColors } from '@/src/shared/theme/tokens'

const KEY = 'gm.nightMode'

export type ThemeState = { nightMode: boolean; hydrated: boolean }

export const hydrateTheme = createAsyncThunk('theme/hydrate', async () => (await SecureStore.getItemAsync(KEY)) === '1')

export const setNightMode = createAsyncThunk('theme/setNightMode', async (on: boolean) => {
  await SecureStore.setItemAsync(KEY, on ? '1' : '0')
  return on
})

const slice = createSlice({
  name: 'theme',
  initialState: { nightMode: false, hydrated: false } as ThemeState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(hydrateTheme.fulfilled, (s, { payload }) => {
      s.nightMode = payload
      s.hydrated = true
    })
    b.addCase(hydrateTheme.rejected, (s) => {
      s.hydrated = true
    })
    b.addCase(setNightMode.fulfilled, (s, { payload }) => {
      s.nightMode = payload
    })
  },
})

export const themeReducer = slice.reducer

export const selectNightMode = (s: { theme: ThemeState }): boolean => s.theme.nightMode
export const selectColors = (s: { theme: ThemeState }): ThemeColors =>
  s.theme.nightMode ? darkColors : lightColors
