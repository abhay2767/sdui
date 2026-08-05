import { Platform, TextStyle } from 'react-native';
import { msc } from './responsive';

/**
 * Typography, following the Barber-app pattern of a named-weight family map
 * plus a semantic variant scale.
 *
 * The reference app bundles Manrope; this project deliberately ships no font
 * binaries (nothing native to link, nothing to break a reviewer's build), so
 * the family map targets the platform system stack at equivalent weights.
 * Swapping in a bundled family later means editing exactly this map.
 */
export const FONTS = {
  regular: Platform.select({ ios: 'System', android: 'sans-serif' }) as string,
  medium: Platform.select({ ios: 'System', android: 'sans-serif-medium' }) as string,
  semiBold: Platform.select({ ios: 'System', android: 'sans-serif-medium' }) as string,
  bold: Platform.select({ ios: 'System', android: 'sans-serif' }) as string,
  mono: Platform.select({ ios: 'Menlo', android: 'monospace' }) as string,
};

/** Semantic scale. All sizes pass through msc() so fonts scale with device
 *  width but stay clamped against absurd tablet/split-screen blowups. */
export const TEXT_VARIANTS: Record<string, TextStyle> = {
  display: { fontSize: msc(26), fontWeight: '900' },
  title: { fontSize: msc(20), fontWeight: '800' },
  sectionTitle: { fontSize: msc(17), fontWeight: '800' },
  subtitle: { fontSize: msc(13), fontWeight: '600' },
  body: { fontSize: msc(14), fontWeight: '400' },
  caption: { fontSize: msc(11), fontWeight: '500' },
  price: { fontSize: msc(18), fontWeight: '800' },
};

export type TextVariant = keyof typeof TEXT_VARIANTS;

/** Raw font sizes for places that compose their own text styles. */
export const FONT_SIZE = {
  xs: msc(10),
  sm: msc(11),
  md: msc(12),
  base: msc(13),
  lg: msc(14),
  xl: msc(16),
  xxl: msc(18),
  display: msc(22),
};
