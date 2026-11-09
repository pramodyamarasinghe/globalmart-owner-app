import type { ReactNode } from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import { SafeAreaView, type Edge } from 'react-native-safe-area-context'
import { useLayout } from '@/src/shared/hooks/useLayout'
import { useColors } from '@/src/features/theme/useTheme'
import { radius, space, type } from '@/src/shared/theme/tokens'

export function Screen({
  children,
  style,
  edges = ['left', 'right'],
}: {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  edges?: Edge[]
}) {
  const c = useColors()
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: c.canvas }, style]} edges={edges}>
      {children}
    </SafeAreaView>
  )
}

export function Content({
  children,
  style,
}: {
  children: ReactNode
  style?: StyleProp<ViewStyle>
}) {
  const { contentStyle } = useLayout()
  return <View style={[contentStyle, style]}>{children}</View>
}

export function Title({ children }: { children: ReactNode }) {
  const c = useColors()
  return <Text style={[type.title, { color: c.ink }]}>{children}</Text>
}

export function Heading({ children }: { children: ReactNode }) {
  const c = useColors()
  return <Text style={[type.heading, { color: c.ink }]}>{children}</Text>
}

export function Body({ children, muted }: { children: ReactNode; muted?: boolean }) {
  const c = useColors()
  return <Text style={[type.body, { color: muted ? c.inkMuted : c.ink }]}>{children}</Text>
}

export function Caption({ children, muted }: { children: ReactNode; muted?: boolean }) {
  const c = useColors()
  return <Text style={[type.caption, { color: muted ? c.inkMuted : c.ink }]}>{children}</Text>
}

export function Field({ label, ...props }: { label: string } & TextInputProps) {
  const c = useColors()
  const { touchMin } = useLayout()
  return (
    <View style={{ gap: 6 }}>
      <Text style={[type.label, { color: c.inkMuted }]}>{label}</Text>
      <TextInput
        placeholderTextColor={c.inkFaint}
        style={[
          type.body,
          {
            color: c.ink,
            backgroundColor: c.panel,
            borderWidth: 1,
            borderColor: c.line,
            borderRadius: radius.md,
            paddingHorizontal: space.lg,
            paddingVertical: space.md,
            minHeight: touchMin,
          },
        ]}
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
      />
    </View>
  )
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
}: {
  label: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  disabled?: boolean
  loading?: boolean
}) {
  const c = useColors()
  const { touchMin } = useLayout()
  const isDisabled = disabled || loading
  const bg =
    variant === 'primary'
      ? c.accent
      : variant === 'danger'
        ? c.danger
        : variant === 'secondary'
          ? c.accentSoft
          : 'transparent'
  const fg =
    variant === 'primary' || variant === 'danger' ? '#FFFFFF' : variant === 'ghost' ? c.inkMuted : c.accentDark

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          minHeight: Math.max(48, touchMin),
          borderRadius: radius.md,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: space.lg,
          backgroundColor: bg,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: c.line,
          opacity: isDisabled ? 0.45 : pressed ? 0.9 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={[type.bodyStrong, { color: fg }]}>{label}</Text>
      )}
    </Pressable>
  )
}

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}) {
  const c = useColors()
  const { contentStyle } = useLayout()
  return (
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: space.xl }, contentStyle]}>
      <Text style={[type.heading, { color: c.ink }]}>{title}</Text>
      <Text style={[type.body, { color: c.inkMuted, textAlign: 'center', marginTop: space.sm }]}>{message}</Text>
      {actionLabel && onAction ? (
        <View style={{ marginTop: space.lg, alignSelf: 'stretch' }}>
          <Button label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  )
}

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const c = useColors()
  return (
    <View
      style={{
        backgroundColor: c.dangerSoft,
        borderRadius: radius.md,
        padding: space.md,
        gap: space.sm,
        marginBottom: space.md,
      }}
    >
      <Text style={[type.caption, { color: c.danger }]}>{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} hitSlop={8}>
          <Text style={[type.captionStrong, { color: c.danger }]}>Retry</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

export function LoadingBlock({ label = 'Loading…' }: { label?: string }) {
  const c = useColors()
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl }}>
      <ActivityIndicator color={c.accent} size="large" />
      <Text style={[type.caption, { color: c.inkMuted, marginTop: space.md }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({})
