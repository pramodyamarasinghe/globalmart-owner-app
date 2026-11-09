import { StyleSheet, View } from 'react-native'
import { Bone, Skeleton } from '@/src/shared/components/Skeleton'
import { useLayout } from '@/src/shared/hooks/useLayout'
import { useColors } from '@/src/features/theme/useTheme'
import { radius, space } from '@/src/shared/theme/tokens'

/** Placeholder for the report list: same row shape as ReportsScreen so nothing jumps when it loads. */
export function ReportListSkeleton() {
  const c = useColors()
  const { gutter, contentMaxWidth, touchMin } = useLayout()
  return (
    <Skeleton style={{ paddingHorizontal: gutter }}>
      {[4, 3, 4].map((rows, g) => (
        <View key={g} style={{ maxWidth: contentMaxWidth, width: '100%', alignSelf: 'center' }}>
          <Bone width={80} height={10} style={{ marginTop: space.lg, marginBottom: space.sm }} />
          {Array.from({ length: rows }, (_, i) => (
            <View
              key={i}
              style={[styles.row, { minHeight: touchMin, backgroundColor: c.panel, borderColor: c.line }]}
            >
              <Bone width={32} height={32} radius={10} />
              <Bone width="55%" height={14} />
            </View>
          ))}
        </View>
      ))}
    </Skeleton>
  )
}

/** Placeholder for a report body: a totals card and a few row cards, like ReportViewer. */
export function ReportCardsSkeleton() {
  const c = useColors()
  const { gutter, contentMaxWidth } = useLayout()
  return (
    <Skeleton style={{ paddingHorizontal: gutter, paddingVertical: space.lg }}>
      <View style={{ maxWidth: contentMaxWidth, width: '100%', alignSelf: 'center', gap: space.md }}>
        {[0, 1, 2, 3].map((n) => (
          <View key={n} style={[styles.card, { backgroundColor: c.panel, borderColor: c.line }]}>
            <Bone width="50%" height={18} style={{ marginBottom: 4 }} />
            {[0, 1, 2, 3, 4].map((k) => (
              <View key={k} style={styles.kv}>
                <Bone width="35%" height={12} />
                <Bone width="25%" height={12} />
              </View>
            ))}
          </View>
        ))}
      </View>
    </Skeleton>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: 8,
  },
  card: { borderRadius: radius.lg, padding: space.md, borderWidth: 1, gap: 6 },
  kv: { flexDirection: 'row', justifyContent: 'space-between', gap: space.md },
})
