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
  // Canvas & tonal surfaces
  canvas: '#111215',
  surface: '#18181D',
  surfaceAlt: '#141519',
  elevated: '#1E1F25',
  trackBg: '#32333B',

  // Text hierarchy
  text: '#FFFFFF',
  textOn: '#000000', // text on white/gold fills
  muted: '#8E8E98',
  faint: '#707078',
  faintest: '#65656E',

  // Commerce gold (price, badges, discount timer, owned states ONLY)
  gold: '#D4AF37',
  goldLight: '#F5D97A',
  goldDeep: '#B8860B',
  goldTint: 'rgba(212,175,55,0.15)',
  goldBorder: 'transparent',

  // Status
  success: '#34D399',
  danger: '#FF6B6B',

  // Hairline strokes (borders removed across the whole app)
  hairline: 'transparent',
  hairlineStrong: 'transparent',

  // Artwork accent set (ConcentricArtwork themes, category tiles)
  peach: '#FF6F61',
  peachLight: '#FF9E7D',
  teal: '#2EC4B6',
  tealLight: '#5EEAD4',
  crimson: '#E63946',
  crimsonLight: '#FF6B6B',
  purple: '#9B5DE5',
  purpleLight: '#D8B4FE',
  blue: '#3B82F6',
  blueLight: '#93C5FD',

  // Ambient glow (top-of-screen wash)
  ambientWarm: 'rgba(255,111,97,0.16)',
  ambientCool: 'rgba(46,196,182,0.05)',
} as const;

// ── 2. Spacing scale (4px base) ──────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  screen: 16,
  section: 28,
} as const;

// ── 3. Radii scale ───────────────────────────────────────────────────────
export const Radii = {
  sm: 12,
  md: 16,
  card: 24,
  pill: 999,
} as const;

// ── 4. Typography presets (reference-matched) ────────────────────────────
// One preset = font family + size + weight + letterSpacing + lineHeight.
// Usage: <Text style={Type.title}>…</Text> or array with color styles.
export const Type = {
  pageTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  sectionLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    letterSpacing: -0.2,
  },
  cardTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 15.5,
    letterSpacing: -0.3,
    lineHeight: 20,
  },
  chapterTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    lineHeight: 22,
  },
  body: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  bodyMedium: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    lineHeight: 20,
  },
  small: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
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
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 26,
    letterSpacing: -0.5,
  },
  heroSerifless: {
    fontFamily: 'Inter-Bold',
    fontSize: 34,
    letterSpacing: -0.8,
    lineHeight: 41,
  },
} as const;

// ── 5. Shadows (floating layers ONLY: tab bar, modals, toast, player) ────
export const Shadows = {
  float: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 12,
    elevation: 6,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 8,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
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
    borderRadius: Radii.card,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: 48,
  },
  primaryBtnText: {
    color: Colors.textOn,
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
});

// ── 7. Legacy aliases (transition shims — will be pruned as files migrate)
export const ColorsLegacy = {
  background: Colors.canvas,
  surface1: Colors.surface,
  surface2: Colors.elevated,
  surface3: Colors.trackBg,
  textSecondary: Colors.muted,
  textFaint: Colors.faintest,
} as const;