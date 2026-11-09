import * as SecureStore from 'expo-secure-store'
import { create } from 'zustand'
import { darkColors, lightColors, type ThemeColors } from '@/src/theme/tokens'

const KEY = 'gm.nightMode'

type ThemeState = {
  nightMode: boolean
  colors: ThemeColors
  hydrated: boolean
  hydrate: () => Promise<void>
  setNightMode: (on: boolean) => Promise<void>
  toggleNightMode: () => Promise<void>
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  nightMode: false,
  colors: lightColors,
  hydrated: false,

  hydrate: async () => {
    const raw = await SecureStore.getItemAsync(KEY)
    const nightMode = raw === '1'
    set({
      nightMode,
      colors: nightMode ? darkColors : lightColors,
      hydrated: true,
    })
  },

  setNightMode: async (on) => {
    await SecureStore.setItemAsync(KEY, on ? '1' : '0')
    set({ nightMode: on, colors: on ? darkColors : lightColors })
  },

  toggleNightMode: async () => {
    await get().setNightMode(!get().nightMode)
  },
}))

export function useColors(): ThemeColors {
  return useThemeStore((s) => s.colors)
}
