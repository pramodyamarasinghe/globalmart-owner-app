import { useState, type ComponentProps } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLayout } from '@/src/shared/hooks/useLayout'
import { useColors } from '@/src/features/theme/useTheme'
import { radius, type } from '@/src/shared/theme/tokens'

export function LoginField({
  label,
  icon,
  hint,
  secure,
  ...props
}: {
  label: string
  icon: ComponentProps<typeof Ionicons>['name']
  hint?: string
  secure?: boolean
} & ComponentProps<typeof TextInput>) {
  const c = useColors()
  const { touchMin } = useLayout()
  const [show, setShow] = useState(false)
  const [focused, setFocused] = useState(false)

  return (
    <View style={styles.fieldBlock}>
      <Text style={[type.label, { color: c.ink }]}>{label}</Text>
      {hint ? <Text style={[type.caption, { color: c.inkMuted, marginTop: 2 }]}>{hint}</Text> : null}
      <View
        style={[
          styles.inputRow,
          {
            minHeight: Math.max(52, touchMin),
            backgroundColor: c.searchBg,
            borderColor: focused ? c.accent : c.line,
            borderWidth: focused ? 1.5 : 1,
          },
        ]}
      >
        <Ionicons name={icon} size={18} color={focused ? c.accentDark : c.inkFaint} style={{ marginLeft: 14 }} />
        <TextInput
          {...props}
          secureTextEntry={secure && !show}
          placeholderTextColor={c.inkFaint}
          onFocus={(e) => {
            setFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            props.onBlur?.(e)
          }}
          style={[type.body, styles.input, { color: c.ink }]}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {secure ? (
          <Pressable onPress={() => setShow((v) => !v)} hitSlop={10} style={styles.eye}>
            <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={18} color={c.inkFaint} />
          </Pressable>
        ) : (
          <View style={{ width: 12 }} />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  fieldBlock: { gap: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  eye: { paddingHorizontal: 14, paddingVertical: 10 },
})
