import { hs, vs } from './responsive';

/**
 * Spacing/radius scale. Horizontal gaps scale with width (hs), vertical
 * rhythm with height (vs) — the Barber-app convention.
 */
export const SPACING = {
  xs: hs(4),
  sm: hs(8),
  md: hs(12),
  lg: hs(16),
  xl: hs(24),
};

export const VSPACE = {
  xs: vs(4),
  sm: vs(8),
  md: vs(12),
  lg: vs(16),
  xl: vs(24),
};

export const RADIUS = {
  sm: hs(6),
  md: hs(10),
  lg: hs(16),
  xl: hs(24),
  pill: 999,
};

/** Shared layout constants. */
export const universalPaddingHorizontal = hs(16);
export const buttonHeight = vs(48);
export const cardImageHeight = vs(140);
export const heroImageHeight = vs(220);
