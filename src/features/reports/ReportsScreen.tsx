import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { AppHeader } from '@/src/shared/components/AppHeader'
import { Content, EmptyState, ErrorBanner, Screen } from '@/src/shared/components/ui'
import { useLayout } from '@/src/shared/hooks/useLayout'
import { useColors } from '@/src/features/theme/useTheme'
import { radius, space, type } from '@/src/shared/theme/tokens'
import { PeriodPicker } from './components/PeriodPicker'
import { ReportListSkeleton } from './components/ReportSkeletons'
import { useReportList } from './useReports'

export default function ReportsScreen() {
  const router = useRouter()
  const c = useColors()
  const { gutter, contentMaxWidth, listBottomPad, touchMin } = useLayout()
  const { sections, hasNames, loading, error, refetch } = useReportList()

  return (
    <Screen>
      <AppHeader title="Reports" subtitle="Pick a period, then open a report" />
      <PeriodPicker />

      {loading ? (
        <ReportListSkeleton />
      ) : error && !hasNames ? (
        <EmptyState
          title="Reports are not available"
          message={error}
          actionLabel="Try again"
          onAction={refetch}
        />
      ) : (
        <SectionList
          ListHeaderComponent={
            error ? (
              <Content style={{ paddingTop: space.md }}>
                <ErrorBanner message={error} onRetry={refetch} />
              </Content>
            ) : undefined
          }
          sections={sections}
          keyExtractor={(item) => item.name}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{ paddingBottom: listBottomPad }}
          renderSectionHeader={({ section }) => (
            <View style={{ paddingHorizontal: gutter }}>
              <Text
                style={[
                  type.label,
                  {
                    color: c.inkFaint,
                    maxWidth: contentMaxWidth,
                    width: '100%',
                    alignSelf: 'center',
                    paddingTop: space.lg,
                    paddingBottom: space.sm,
                  },
                ]}
              >
                {section.title}
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: gutter }}>
              <Pressable
                style={({ pressed }) => [
                  styles.row,
                  {
                    minHeight: touchMin,
                    maxWidth: contentMaxWidth,
                    width: '100%',
                    alignSelf: 'center',
                    backgroundColor: pressed ? c.accentSoft : c.panel,
                    borderColor: c.line,
                  },
                ]}
                onPress={() => router.push(`/(tabs)/reports/${item.name}`)}
              >
                <View style={[styles.icon, { backgroundColor: c.accentSoft }]}>
                  <Ionicons name="document-text-outline" size={16} color={c.accentDark} />
                </View>
                <Text style={[type.bodyStrong, { color: c.ink, flex: 1 }]}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={18} color={c.inkFaint} />
              </Pressable>
            </View>
          )}
          ListEmptyComponent={
            <EmptyState title="No reports" message="The API returned an empty list." />
          }
        />
      )}
    </Screen>
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
  icon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
