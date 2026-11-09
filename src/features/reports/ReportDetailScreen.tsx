import { Suspense, lazy, useLayoutEffect } from 'react'
import { RefreshControl, ScrollView } from 'react-native'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { Content, EmptyState, ErrorBanner, Screen } from '@/src/shared/components/ui'
import { useLayout } from '@/src/shared/hooks/useLayout'
import { useColors } from '@/src/features/theme/useTheme'
import { space } from '@/src/shared/theme/tokens'
import { PeriodPicker } from './components/PeriodPicker'
import { ReportCardsSkeleton } from './components/ReportSkeletons'
import { useReport } from './useReports'

// The viewer is only needed once a report has data.
const ReportViewer = lazy(() =>
  import('./components/ReportViewer').then((m) => ({ default: m.ReportViewer }))
)

export default function ReportDetailScreen() {
  const { name: raw } = useLocalSearchParams<{ name: string }>()
  const name = Array.isArray(raw) ? raw[0] : raw
  const navigation = useNavigation()
  const { listBottomPad } = useLayout()
  const c = useColors()
  const { meta, data, loading, refreshing, error, refetch } = useReport(name)

  useLayoutEffect(() => {
    navigation.setOptions({ title: `GlobalMart ${meta.title}` })
  }, [navigation, meta.title])

  return (
    <Screen>
      {meta.needsDates && !meta.noParams ? <PeriodPicker /> : null}

      {loading ? (
        <ReportCardsSkeleton />
      ) : data == null ? (
        <EmptyState
          title={error ? 'This report could not be loaded' : 'No data'}
          message={error ?? 'Nothing to show for this period.'}
          actionLabel={error ? 'Try again' : 'Retry'}
          onAction={refetch}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: listBottomPad }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refetch} tintColor={c.accent} />
          }
        >
          {/* A refresh that failed keeps the rows on screen and says so at the top. */}
          {error ? (
            <Content style={{ paddingTop: space.md }}>
              <ErrorBanner message={error} onRetry={refetch} />
            </Content>
          ) : null}
          <Suspense fallback={<ReportCardsSkeleton />}>
            <ReportViewer data={data} />
          </Suspense>
        </ScrollView>
      )}
    </Screen>
  )
}
