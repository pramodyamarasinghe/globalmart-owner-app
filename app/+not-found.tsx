import { Link, Stack } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { colors, space, type } from '@/src/theme/tokens'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen does not exist.</Text>
        <Link href="/(tabs)/pos" style={styles.link}>
          <Text style={styles.linkText}>Back to POS</Text>
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.xl,
    backgroundColor: colors.canvas,
  },
  title: { ...type.heading, color: colors.ink },
  link: { marginTop: space.lg, paddingVertical: space.md },
  linkText: { ...type.bodyStrong, color: colors.accent },
})
