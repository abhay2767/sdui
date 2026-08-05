/**
 * Cars24 palette, structured after the Barber-app theme contract
 * (semantic names, a typed interface, light/dark ready). Brand colors stay
 * Cars24's — the reference app contributes the *system*, not its palette.
 */
export interface ThemeColors {
  primary: string;
  primarySoft: string;
  ink: string;
  inkSoft: string;
  muted: string;
  faint: string;
  line: string;
  surface: string;
  canvas: string;
  success: string;
  info: string;
  warning: string;
  danger: string;
  onDark: string;
  // Semantic aliases
  background: string;
  text: string;
  textSecondary: string;
  border: string;
  buttonBg: string;
  buttonText: string;
  overlay: string;
  transparent: string;
  // Dark chrome (headers, perf bar, nav bars)
  chromeBg: string;
  chromeLine: string;
  chromeSurface: string;
  skeletonBase: string;
  skeletonHighlight: string;
}

export const COLORS: ThemeColors = {
  primary: '#FF6B00',
  primarySoft: '#FFF7ED',
  ink: '#0F172A',
  inkSoft: '#334155',
  muted: '#64748B',
  faint: '#94A3B8',
  line: '#E2E8F0',
  surface: '#FFFFFF',
  canvas: '#F8FAFC',
  success: '#10B981',
  info: '#38BDF8',
  warning: '#F59E0B',
  danger: '#EF4444',
  onDark: '#F8FAFC',

  background: '#F8FAFC',
  text: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  buttonBg: '#FF6B00',
  buttonText: '#FFFFFF',
  overlay: 'rgba(15, 23, 42, 0.6)',
  transparent: 'transparent',

  chromeBg: '#0F172A',
  chromeLine: '#1E293B',
  chromeSurface: '#1E293B',
  skeletonBase: '#E2E8F0',
  skeletonHighlight: '#F1F5F9',
};

export type ColorToken = keyof ThemeColors;

/** Resolves a token name, a literal hex/rgba value, or undefined. */
export function color(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  return (COLORS as unknown as Record<string, string>)[value] ?? value;
}
