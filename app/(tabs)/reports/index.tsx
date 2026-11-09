import { useCallback, useMemo, useState } from 'react'
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import { ApiError } from '@/src/api/client'
import { GROUP_ORDER, REPORT_META, type ReportMeta } from '@/src/api/reportMeta'
import { listReports } from '@/src/api/reports'
import { AppHeader } from '@/src/components/AppHeader'
import { PeriodPicker } from '@/src/components/PeriodPicker'
import { Content, EmptyState, ErrorBanner, LoadingBlock, Screen } from '@/src/components/ui'
import { useLayout } from '@/src/layout/useLayout'
import { useColors } from '@/src/store/theme'
import { radius, space, type } from '@/src/theme/tokens'

export default function ReportsIndex() {
  const router = useRouter()
  const c = useColors()
  const { gutter, contentMaxWidth, listBottomPad, touchMin } = useLayout()
  const [names, setNames] = useState<string[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setNames(await listReports())
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load reports.')
      setNames(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      void load()
    }, [load])
  )

  const sections = useMemo(() => {
    const available = new Set(names ?? REPORT_META.map((r) => r.name))
    const byGroup = new Map<string, ReportMeta[]>()
    for (const meta of REPORT_META) {
      if (!available.has(meta.name)) continue
      const list = byGroup.get(meta.group) ?? []
      list.push(meta)
      byGroup.set(meta.group, list)
    }
    if (names) {
      for (const name of names) {
        if (REPORT_META.some((m) => m.name === name)) continue
        const list = byGroup.get('Finance') ?? []
        list.push({ name, title: name, group: 'Finance', needsDates: true })
        byGroup.set('Finance', list)
      }
    }
    return GROUP_ORDER.filter((g) => byGroup.has(g)).map((g) => ({
      title: g,
      data: byGroup.get(g)!,
    }))
  }, [names])

  return (
    <Screen>
      <AppHeader title="Reports" subtitle="Pick a period, then open a report" />
      <PeriodPicker />

      {loading ? (
        <LoadingBlock label="Loading reports…" />
      ) : error && !names ? (
        <>
          <Content style={{ paddingTop: space.md }}>
            <ErrorBanner message={error} onRetry={() => void load()} />
          </Content>
          <EmptyState title="Cannot load reports" message={error} actionLabel="Retry" onAction={() => void load()} />
        </>
      ) : (
        <SectionList
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
