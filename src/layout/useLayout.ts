import { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { space } from '@/src/theme/tokens'

export type Breakpoint = 'phone' | 'phablet' | 'tablet'

/** Shared safe-area + responsive metrics for any phone / tablet. */
export function useLayout() {
  const { width, height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  return useMemo(() => {
    const shortest = Math.min(width, height)
    const breakpoint: Breakpoint =
      shortest >= 768 ? 'tablet' : shortest >= 400 ? 'phablet' : 'phone'

    const gutter =
      breakpoint === 'tablet' ? space.xxl : breakpoint === 'phablet' ? space.xl : space.lg
    const contentMaxWidth = breakpoint === 'tablet' ? 720 : breakpoint === 'phablet' ? 560 : width
    const scale = breakpoint === 'tablet' ? 1.06 : breakpoint === 'phone' && width < 360 ? 0.94 : 1
    const touchMin = Math.max(44, Math.round(44 * scale))
    const tabBarBase = 56
    const tabBarHeight = tabBarBase + Math.max(insets.bottom, 8)
    const listBottomPad = space.xxl + insets.bottom
    const floatingBottom = space.lg + Math.max(insets.bottom, 8)

    return {
      width,
      height,
      insets,
      breakpoint,
      isTablet: breakpoint === 'tablet',
      gutter,
      contentMaxWidth,
      scale,
      touchMin,
      tabBarHeight,
      listBottomPad,
      floatingBottom,
      contentStyle: {
        width: '100%' as const,
        maxWidth: contentMaxWidth,
        alignSelf: 'center' as const,
        paddingHorizontal: gutter,
      },
    }
  }, [width, height, insets])
}
