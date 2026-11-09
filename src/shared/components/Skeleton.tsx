import { useEffect, useRef, type ReactNode } from 'react'
import { AccessibilityInfo, Animated, View, type DimensionValue, type ViewStyle } from 'react-native'
import { useColors } from '@/src/features/theme/useTheme'

/** One shared pulse for every Bone inside it (and none when the device asks for reduced motion). */
export function Skeleton({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const opacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null
    let cancelled = false
    void AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled || reduce) return
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0.45, duration: 700, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        ])
      )
      loop.start()
    })
    return () => {
      cancelled = true
      loop?.stop()
    }
  }, [opacity])

  return (
    <Animated.View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      style={[{ opacity }, style]}
    >
      {children}
    </Animated.View>
  )
}

export function Bone({
  width = '100%',
  height = 14,
  radius = 6,
  style,
}: {
  width?: DimensionValue
  height?: number
  radius?: number
  style?: ViewStyle
}) {
  const c = useColors()
  return <View style={[{ width, height, borderRadius: radius, backgroundColor: c.line }, style]} />
}
