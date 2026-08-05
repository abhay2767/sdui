import { useEffect, useMemo, useState } from 'react';
import { Dimensions, Platform, ScaledSize } from 'react-native';

export const isIos = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Guideline sizes are based on standard iPhone 11 (375 x 812)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

type ScreenState = {
  window: ScaledSize;
  screen: ScaledSize;
};

const getState = (): ScreenState => ({
  window: Dimensions.get('window'),
  screen: Dimensions.get('screen'),
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Pure scaling helpers (require width/height passed in) so the hook flavour
 * stays reactive on rotation / split-screen.
 */
const createScales = (w: number, h: number) => {
  const hs = (size: number) => (w / BASE_WIDTH) * size; // horizontal scale
  const vs = (size: number) => (h / BASE_HEIGHT) * size; // vertical scale

  // moderate scale: blends original size with scaled size
  const ms = (size: number, factor = 0.5) => size + (hs(size) - size) * factor;

  // Clamped versions (recommended for font sizes)
  const hsc = (size: number, min = size * 0.85, max = size * 1.25) =>
    clamp(hs(size), min, max);

  const vsc = (size: number, min = size * 0.85, max = size * 1.25) =>
    clamp(vs(size), min, max);

  const msc = (size: number, factor = 0.5, min = size * 0.85, max = size * 1.25) =>
    clamp(ms(size, factor), min, max);

  return { hs, vs, ms, hsc, vsc, msc };
};

/**
 * Reactive hook — updates on rotation / split-screen changes. Use inside
 * components whose layout depends on live window size (grids, carousels).
 */
export const useResponsive = () => {
  const [state, setState] = useState<ScreenState>(getState());

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window, screen }) => {
      setState({ window, screen });
    });
    return () => sub?.remove?.();
  }, []);

  const { width, height } = state.window;

  const flags = useMemo(() => {
    const isSmallDevice = height < 700 || width < 360;
    const isLargeDevice = height > 840 || width > 430;
    const isTablet = Math.min(width, height) >= 600;
    return { isSmallDevice, isLargeDevice, isTablet, isAndroid, isIos };
  }, [width, height]);

  const scales = useMemo(() => createScales(width, height), [width, height]);

  return useMemo(
    () => ({
      ...scales,
      ...flags,
      window: state.window,
      screen: state.screen,
      fullWidth: state.screen.width,
      fullHeight: state.screen.height,
    }),
    [scales, flags, state.window, state.screen],
  );
};

/**
 * Static helpers for `StyleSheet.create` at module scope (no hooks there).
 * They read Dimensions at call time; styles created at import time therefore
 * scale to the launch window — the reactive hook covers live-rotation cases.
 */
export const responsive = {
  hs: (size: number) => (Dimensions.get('window').width / BASE_WIDTH) * size,
  vs: (size: number) => (Dimensions.get('window').height / BASE_HEIGHT) * size,
  ms: (size: number, factor = 0.5) => {
    const w = Dimensions.get('window').width;
    return size + ((w / BASE_WIDTH) * size - size) * factor;
  },
  hsc: (size: number, min = size * 0.85, max = size * 1.25) =>
    clamp((Dimensions.get('window').width / BASE_WIDTH) * size, min, max),
  vsc: (size: number, min = size * 0.85, max = size * 1.25) =>
    clamp((Dimensions.get('window').height / BASE_HEIGHT) * size, min, max),
  msc: (size: number, factor = 0.5, min = size * 0.85, max = size * 1.25) => {
    const w = Dimensions.get('window').width;
    const scaled = size + ((w / BASE_WIDTH) * size - size) * factor;
    return clamp(scaled, min, max);
  },
  isSmallDevice: () => {
    const { width, height } = Dimensions.get('window');
    return height < 700 || width < 360;
  },
  isLargeDevice: () => {
    const { width, height } = Dimensions.get('window');
    return height > 840 || width > 430;
  },
  isAndroid,
  isIos,
  window: () => Dimensions.get('window'),
  screen: () => Dimensions.get('screen'),
};

/** Shorthand aliases used across stylesheets. */
export const hs = responsive.hs;
export const vs = responsive.vs;
export const ms = responsive.ms;
export const hsc = responsive.hsc;
export const vsc = responsive.vsc;
export const msc = responsive.msc;
