import { useState } from 'react'
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLayout } from '@/src/layout/useLayout'
import {
  PERIOD_OPTIONS,
  dateToIso,
  isoToDate,
  useReportPeriod,
} from '@/src/store/reportPeriod'
import { useColors } from '@/src/store/theme'
import { radius, space, type } from '@/src/theme/tokens'
import { Button } from './ui'

type PickerTarget = 'from' | 'to' | null

export function PeriodPicker() {
  const c = useColors()
  const insets = useSafeAreaInsets()
  const { gutter, contentMaxWidth } = useLayout()
  const key = useReportPeriod((s) => s.key)
  const range = useReportPeriod((s) => s.range)
  const setPeriod = useReportPeriod((s) => s.setPeriod)
  const setCustomRange = useReportPeriod((s) => s.setCustomRange)

  const [calendarOpen, setCalendarOpen] = useState(false)
  const [draftFrom, setDraftFrom] = useState(range.from)
  const [draftTo, setDraftTo] = useState(range.to)
  const [picking, setPicking] = useState<PickerTarget>(null)

  function openCalendar() {
    setDraftFrom(range.from)
    setDraftTo(range.to)
    setCalendarOpen(true)
    setPicking(null)
  }

  function applyCalendar() {
    let from = draftFrom
    let to = draftTo
    if (from > to) [from, to] = [to, from]
    setCustomRange({ from, to })
    setCalendarOpen(false)
    setPicking(null)
  }

  function onNativeChange( whicht: 'from' | 'to', event: DateTimePickerEvent, date?: Date) {
    if (Platform.OS === 'android') setPicking(null)
    if (event.type === 'dismissed' || !date) return
    const iso = dateToIso(date)
    if (whicht === 'from') setDraftFrom(iso)
    else setDraftTo(iso)
  }

  const customActive = key === 'custom'

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: c.surface, borderBottomColor: c.lineSoft, paddingHorizontal: gutter },
      ]}
    >
      <View style={{ maxWidth: contentMaxWidth, width: '100%', alignSelf: 'center', gap: space.sm }}>
        <View style={styles.labelRow}>
          <Ionicons name="calendar-outline" size={16} color={c.accentDark} />
          <Text style={[type.label, { color: c.inkMuted }]}>Time period</Text>
          <Text style={[type.captionStrong, { color: c.ink, marginLeft: 'auto' }]}>
            {range.from} → {range.to}
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {PERIOD_OPTIONS.map((opt) => {
            const active = opt.key === key
            return (
              <Pressable
                key={opt.key}
                onPress={() => setPeriod(opt.key)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? c.accent : c.searchBg,
                    borderColor: active ? c.accentDark : c.line,
                  },
                ]}
              >
                <Text style={[type.captionStrong, { color: active ? '#fff' : c.ink }]}>{opt.label}</Text>
              </Pressable>
            )
          })}

          <Pressable
            onPress={openCalendar}
            style={[
              styles.chip,
              styles.calendarChip,
              {
                backgroundColor: customActive ? c.accent : c.searchBg,
                borderColor: customActive ? c.accentDark : c.line,
              },
            ]}
          >
            <Ionicons name="calendar" size={14} color={customActive ? '#fff' : c.accentDark} />
            <Text style={[type.captionStrong, { color: customActive ? '#fff' : c.ink }]}>Calendar</Text>
          </Pressable>
        </ScrollView>

        {customActive ? (
          <Pressable onPress={openCalendar} style={[styles.customHint, { backgroundColor: c.accentSoft }]}>
            <Ionicons name="create-outline" size={14} color={c.accentDark} />
            <Text style={[type.caption, { color: c.accentDark, flex: 1 }]}>
              Custom range selected — tap to change dates
            </Text>
          </Pressable>
        ) : null}
      </View>

      <Modal visible={calendarOpen} animationType="slide" transparent onRequestClose={() => setCalendarOpen(false)}>
        <Pressable style={[styles.backdrop, { backgroundColor: c.overlay }]} onPress={() => setCalendarOpen(false)} />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: c.panel,
              paddingBottom: Math.max(insets.bottom, space.lg),
              borderTopColor: c.accent,
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: c.line }]} />
          <View style={styles.sheetHead}>
            <Ionicons name="calendar" size={20} color={c.accentDark} />
            <Text style={[type.title, { color: c.ink }]}>Select dates</Text>
          </View>
          <Text style={[type.caption, { color: c.inkMuted, marginBottom: space.md }]}>
            Choose a start and end date for reports
          </Text>

          <Pressable
            onPress={() => setPicking('from')}
            style={[styles.dateBtn, { backgroundColor: c.searchBg, borderColor: picking === 'from' ? c.accent : c.line }]}
          >
            <Text style={[type.label, { color: c.inkMuted }]}>FROM</Text>
            <Text style={[type.bodyStrong, { color: c.ink }]}>{draftFrom}</Text>
            <Ionicons name="calendar-outline" size={18} color={c.accentDark} />
          </Pressable>

          <Pressable
            onPress={() => setPicking('to')}
            style={[
              styles.dateBtn,
              {
                backgroundColor: c.searchBg,
                borderColor: picking === 'to' ? c.accent : c.line,
                marginTop: space.sm,
              },
            ]}
          >
            <Text style={[type.label, { color: c.inkMuted }]}>TO</Text>
            <Text style={[type.bodyStrong, { color: c.ink }]}>{draftTo}</Text>
            <Ionicons name="calendar-outline" size={18} color={c.accentDark} />
          </Pressable>

          {picking ? (
            <View style={{ marginTop: space.md }}>
              <DateTimePicker
                value={isoToDate(picking === 'from' ? draftFrom : draftTo)}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                maximumDate={new Date()}
                onChange={(e, d) => onNativeChange(picking, e, d)}
                themeVariant={c.canvas.startsWith('#0') || c.canvas.startsWith('#1') ? 'dark' : 'light'}
              />
              {Platform.OS === 'ios' ? (
                <Button label="Done picking" variant="secondary" onPress={() => setPicking(null)} />
              ) : null}
            </View>
          ) : null}

          <View style={styles.sheetActions}>
            <View style={{ flex: 1 }}>
              <Button label="Cancel" variant="secondary" onPress={() => setCalendarOpen(false)} />
            </View>
            <View style={{ flex: 1.2 }}>
              <Button label="Apply range" onPress={applyCalendar} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: space.md, borderBottomWidth: 1 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chips: { gap: space.sm, paddingRight: space.lg, alignItems: 'center' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  calendarChip: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  customHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
  },
  backdrop: { flex: 1 },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    borderTopWidth: 3,
  },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, marginBottom: space.md },
  sheetHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
  },
  sheetActions: { flexDirection: 'row', gap: space.sm, marginTop: space.lg },
})
