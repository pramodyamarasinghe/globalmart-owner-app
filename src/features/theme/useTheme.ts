import { useAppDispatch, useAppSelector } from '@/src/store/hooks'
import type { ThemeColors } from '@/src/shared/theme/tokens'
import { selectColors, selectNightMode, setNightMode } from './themeSlice'

export function useColors(): ThemeColors {
  return useAppSelector(selectColors)
}

export function useNightMode() {
  const dispatch = useAppDispatch()
  const nightMode = useAppSelector(selectNightMode)
  return { nightMode, setNightMode: (on: boolean) => void dispatch(setNightMode(on)) }
}
