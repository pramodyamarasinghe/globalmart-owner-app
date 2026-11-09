export type ThemeColors = {
  canvas: string
  surface: string
  panel: string
  ink: string
  inkMuted: string
  inkFaint: string
  line: string
  lineSoft: string
  accent: string
  accentDark: string
  accentSoft: string
  accentMuted: string
  danger: string
  dangerSoft: string
  success: string
  successSoft: string
  header: string
  headerText: string
  tabBar: string
  tabInactive: string
  searchBg: string
  overlay: string
  cardShadow: string
}

export const lightColors: ThemeColors = {
  canvas: '#F3FBF6',
  surface: '#FFFFFF',
  panel: '#FFFFFF',
  ink: '#0A0A0A',
  inkMuted: '#3D4A42',
  inkFaint: '#7A8B82',
  line: '#D7E8DC',
  lineSoft: '#EAF5EE',
  accent: '#2FBE6A',
  accentDark: '#1F9A52',
  accentSoft: '#E6F8EE',
  accentMuted: '#A8E5C2',
  danger: '#E11D48',
  dangerSoft: '#FFE4E8',
  success: '#15803D',
  successSoft: '#DCFCE7',
  header: '#FFFFFF',
  headerText: '#0A0A0A',
  tabBar: '#FFFFFF',
  tabInactive: '#8A9A91',
  searchBg: '#F0F7F3',
  overlay: 'rgba(10,20,14,0.45)',
  cardShadow: 'rgba(47,190,106,0.12)',
}

export const darkColors: ThemeColors = {
  canvas: '#0F1612',
  surface: '#162019',
  panel: '#1A2520',
  ink: '#F5FBF7',
  inkMuted: '#B7C7BD',
  inkFaint: '#7F9388',
  line: '#2A3A31',
  lineSoft: '#203028',
  accent: '#3DD87A',
  accentDark: '#2FBE6A',
  accentSoft: '#1B3A28',
  accentMuted: '#2A5A3E',
  danger: '#FB7185',
  dangerSoft: '#3F1D24',
  success: '#4ADE80',
  successSoft: '#14532D',
  header: '#162019',
  headerText: '#F5FBF7',
  tabBar: '#162019',
  tabInactive: '#7F9388',
  searchBg: '#1F2C25',
  overlay: 'rgba(0,0,0,0.55)',
  cardShadow: 'rgba(0,0,0,0.35)',
}

/** @deprecated use theme store — kept for gradual migration */
export const colors = lightColors

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 999,
} as const

export const type = {
  brand: { fontFamily: 'DMSans_700Bold', fontSize: 22, lineHeight: 28 },
  title: { fontFamily: 'DMSans_700Bold', fontSize: 20, lineHeight: 26 },
  heading: { fontFamily: 'DMSans_600SemiBold', fontSize: 16, lineHeight: 22 },
  body: { fontFamily: 'DMSans_400Regular', fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: 'DMSans_600SemiBold', fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: 'DMSans_400Regular', fontSize: 12, lineHeight: 17 },
  captionStrong: { fontFamily: 'DMSans_600SemiBold', fontSize: 12, lineHeight: 17 },
  label: { fontFamily: 'DMSans_500Medium', fontSize: 12, lineHeight: 16 },
  mono: { fontFamily: 'DMSans_600SemiBold', fontSize: 13, lineHeight: 18 },
  total: { fontFamily: 'DMSans_700Bold', fontSize: 22, lineHeight: 28 },
} as const
