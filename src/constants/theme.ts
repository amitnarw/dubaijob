/**
 * DubaiJob design tokens — SINGLE SOURCE OF TRUTH (Tailwind-style).
 * Every color, size, radius, shadow, and text style in the app comes from
 * here. NEVER hardcode hex/rgba values in screens/components.
 *
 * Reference language (podcast app): near-black canvas, tonal elevated
 * cards, white primary actions, muted gray labels, colorful artwork accents.
 * Gold is reserved for COMMERCE ONLY: price, badges, discount timer.
 */

// ── 1. Palette ───────────────────────────────────────────────────────────
export const Colors = {
  // Canvas & surfaces — exactly 3 tones (see design.md)
  canvas: '#121212',
  surface: '#1E1E1E',
  surfaceAlt: '#1E1E1E',
  elevated: '#242424',
  trackBg: '#2E2E2E',

  // Text hierarchy
  text: '#FFFFFF',
  textOn: '#1A1A1A', // text on green/peach fills
  muted: '#9E9E9E',
  faint: '#5F5F5F',
  faintest: '#5F5F5F',

  // EduWave accents — green = primary actions, peach = badges/free/active
  green: '#7BC96F',
  greenDeep: '#4E9B45',
  greenTint: 'rgba(123, 201, 111, 0.15)',
  peach: '#F2A28C',
  peachDeep: '#C96A4E',
  peachTint: 'rgba(242, 162, 140, 0.18)',
  sun: '#E8D06A',

  // Pastel Card Backgrounds & Tonal Tokens (Exact Reference Style)
  mint: '#D2EBE0',
  mintText: '#123826',
  lavender: '#DFDBF5',
  lavenderText: '#221C4E',
  softPeach: '#FBE3D3',
  softPeachText: '#4D2310',
  iceBlue: '#D6EDF8',
  iceBlueText: '#123547',
  softYellow: '#FDF1BA',
  softYellowText: '#443507',
  softCardWhite: '#FFFFFF',

  // Commerce — prices ride on green fills (dark text) or green text
  gold: '#7BC96F',
  goldLight: '#9BDE92',
  goldDeep: '#4E9B45',
  goldTint: '#1C2A1B',
  goldBorder: '#1C2A1B',

  // Legacy accent slots now resolve to the EduWave family
  accent: '#7BC96F',
  accentSoft: '#9BDE92',
  accentTint: '#1C2A1B',

  // Status
  success: '#34D399',
  danger: '#FF6B6B',

  // Hairline strokes removed — all surfaces are flat opaque fills
  hairline: '#0B0C0E',
  hairlineStrong: '#0B0C0E',

  // Sheet / Modal overlay & surface
  sheetBg: '#1E1E1E',
  sheetElevated: '#242424',
  sheetOverlay: 'rgba(0, 0, 0, 0.72)',

  // Warm glow REMOVED (see design.md) — tokens kept as canvas
  glowDeep: '#0A0B0D',
  glowMid: '#0A0B0D',

  // Ambient REMOVED (see design.md)
  ambientWarm: '#0A0B0D',
  ambientCool: '#0A0B0D',
} as const;

export const ChapterCardThemes = {
  mint: {
    bg: '#D2EBE0',
    text: '#123826',
    textMuted: '#355947',
    accent: '#2A7D5B',
    ring: '#9FD4BD',
    tag: 'FOUNDATION',
  },
  lavender: {
    bg: '#DFDBF5',
    text: '#221C4E',
    textMuted: '#4C467A',
    accent: '#5246A3',
    ring: '#B8AFE3',
    tag: 'ATS & RESUME',
  },
  peach: {
    bg: '#FBE3D3',
    text: '#4D2310',
    textMuted: '#7A4A33',
    accent: '#D4622B',
    ring: '#F5C2A4',
    tag: 'TIMING & VISA',
  },
  iceBlue: {
    bg: '#D6EDF8',
    text: '#123547',
    textMuted: '#355E75',
    accent: '#21759B',
    ring: '#A3D4EE',
    tag: 'INTERVIEWS',
  },
  yellow: {
    bg: '#FDF1BA',
    text: '#443507',
    textMuted: '#6E5C20',
    accent: '#B88F0E',
    ring: '#F0DC84',
    tag: 'OFFER & RELOCATION',
  },
} as const;


// ── 2. Spacing scale (4px base, 20 screen margin, 36 sections) ────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  screen: 20,
  section: 36,
} as const;

// ── 3. Radii scale (cards 24, thumbs/rows 16, CTAs 999) ───────────────────
export const Radii = {
  sm: 10,
  md: 16,
  card: 24,
  pill: 999,
} as const;

// ── 4. Typography presets — 4 sizes only (see design.md) ─────────────────
export const Type = {
  pageTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    letterSpacing: -0.8,
    lineHeight: 39,
  },
  sectionLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    letterSpacing: -0.6,
    lineHeight: 28,
  },
  cardTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  chapterTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  body: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 22,
  },
  bodyMedium: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    lineHeight: 20,
  },
  small: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    lineHeight: 17,
  },
  caption: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    lineHeight: 15,
  },
  micro: {
    fontFamily: 'Inter-Medium',
    fontSize: 10.5,
    lineHeight: 14,
  },
  overline: {
    fontFamily: 'Inter-Bold',
    fontSize: 11,
    letterSpacing: 1.5,
    lineHeight: 15,
  },
  numeral: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    letterSpacing: -0.3,
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  heroSerifless: {
    fontFamily: 'Inter-Bold',
    fontSize: 34,
    letterSpacing: -0.8,
    lineHeight: 41,
  },
} as const;

// ── 5. Shadows — REMOVED (see design.md). Depth = tonal contrast only. ────
export const Shadows = {
  float: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  // Layered depth for feature cards (hero, banner, unlock bar)
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
} as const;

// ── 6. Component presets (compose these; don't redefine) ─────────────────
import { StyleSheet } from 'react-native';

export const Presets = StyleSheet.create({
  // Card surface (Top Masterclass, chapter card)
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
  },
  // Small square tile (category)
  tile: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
  },
  // Idle filter pill
  pill: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  // Active filter pill (white fill, black text)
  pillActive: {
    backgroundColor: '#FFFFFF',
  },
  // Text input
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text,
  },
  // Muted section label row
  sectionHeader: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: -0.2,
    color: Colors.muted,
  },
  // White primary action (reference style)
  primaryBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.pill,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: 54,
  },
  primaryBtnText: {
    color: Colors.textOn,
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
});

// ── 7. Artwork themes (shine cards — colored gradient + edge light) ───────
// gradient: card base (edge-light → base → deep). shine: light band color.
// All opaque pre-blended solids.
export const ArtworkThemes = {
  green: {
    gradient: ['#A8E29E', '#7BC96F', '#4E9B45'],
    shine: '#C4EDBB',
    deep: '#3E7D37',
  },
  peach: {
    gradient: ['#F8C4AE', '#F2A28C', '#C96A4E'],
    shine: '#FAD9C9',
    deep: '#A5543C',
  },
  sun: {
    gradient: ['#F2DD8E', '#E8D06A', '#B89B3E'],
    shine: '#F7E9AE',
    deep: '#93792F',
  },
  teal: {
    gradient: ['#9ADBE0', '#5FB9C1', '#3A858C'],
    shine: '#BDE9ED',
    deep: '#2C686E',
  },
  violet: {
    gradient: ['#C4B2F0', '#9B85DE', '#6A55A8'],
    shine: '#D9CCF5',
    deep: '#534285',
  },
} as const;

export type ArtworkThemeName = keyof typeof ArtworkThemes;

// ── 8. Legacy aliases (transition shims — will be pruned as files migrate)
export const ColorsLegacy = {
  background: Colors.canvas,
  surface1: Colors.surface,
  surface2: Colors.elevated,
  surface3: Colors.trackBg,
  textSecondary: Colors.muted,
  textFaint: Colors.faintest,
} as const;