import { useCallback, useLayoutEffect, useState } from 'react'
import { RefreshControl, ScrollView } from 'react-native'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { ApiError } from '@/src/api/client'
import { metaFor } from '@/src/api/reportMeta'
import { getReport } from '@/src/api/reports'
import { PeriodPicker } from '@/src/components/PeriodPicker'
import { ReportViewer } from '@/src/components/ReportViewer'
import { Content, EmptyState, ErrorBanner, LoadingBlock, Screen } from '@/src/components/ui'
import { useLayout } from '@/src/layout/useLayout'
import { useReportPeriod } from '@/src/store/reportPeriod'
import { useColors } from '@/src/store/theme'
import { space } from '@/src/theme/tokens'

export default function ReportDetailScreen() {
  const { name: raw } = useLocalSearchParams<{ name: string }>()
  const name = Array.isArray(raw) ? raw[0] : raw
  const meta = metaFor(name ?? '')
  const navigation = useNavigation()
  const { listBottomPad } = useLayout()
  const c = useColors()
  const range = useReportPeriod((s) => s.range)

  const [data, setData] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useLayoutEffect(() => {
    navigation.setOptions({ title: `GlobalMart ${meta.title}` })
  }, [navigation, meta.title])

  const load = useCallback(
    async (isRefresh = false) => {
      if (!name) return
      if (isRefresh) setRefreshing(true)
      else setLoading(true)
      setError(null)
      try {
        const query = meta.noParams
          ? undefined
          : meta.needsDates
            ? { from: range.from, to: range.to, offset: 0, limit: 50 }
            : undefined
        setData(await getReport(name, query))
      } catch (e) {
        if (e instanceof ApiError && e.status === 400) {
          const issues = (e.body as { issues?: unknown })?.issues
          setError(issues ? `Invalid query: ${JSON.stringify(issues)}` : e.message)
        } else {
          setError(e instanceof ApiError ? e.message : 'Failed to load report.')
        }
        setData(null)
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [name, meta.needsDates, meta.noParams, range.from, range.to]
  )

  useLayoutEffect(() => {
    void load()
  }, [load])

  return (
    <Screen>
      {meta.needsDates && !meta.noParams ? <PeriodPicker /> : null}

      {error ? (
        <Content style={{ paddingTop: space.md }}>
          <ErrorBanner message={error} onRetry={() => void load()} />
        </Content>
      ) : null}

      {loading ? (
        <LoadingBlock />
      ) : data == null ? (
        <EmptyState
          title="No data"
          message={error ?? 'Nothing to show for this period.'}
          actionLabel="Retry"
          onAction={() => void load()}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: listBottomPad }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} tintColor={c.accent} />
          }
        >
          <ReportViewer data={data} />
        </ScrollView>
      )}
    </Screen>
  )
}
