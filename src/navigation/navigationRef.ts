import { createNavigationContainerRef } from '@react-navigation/native';

/** The car object a NAVIGATE payload carries into the details page. */
export interface CarParams {
  id: string;
  title: string;
  price: string;
  year?: number;
  mileage?: string;
  fuel?: string;
  transmission?: string;
  owner?: string;
  emi24?: string;
  emi36?: string;
  emi48?: string;
  emi60?: string;
  imageUrl?: string;
  [extra: string]: unknown;
}

export type RootStackParamList = {
  HomeSDUI: undefined;
  HomeStatic: undefined;
  CarDetails: { car?: CarParams } | undefined;
  PerfBenchmark: undefined;
};

/**
 * Module-level navigation handle. The action dispatcher navigates through
 * this instead of a prop-drilled `navigation` object, so NAVIGATE works from
 * anywhere SDUI renders — screens, bottom-sheet bodies, future portals —
 * without each host threading navigation down.
 */
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Screens a payload is allowed to target. Payloads pass through CMS tooling
 * and humans; a typo'd or hostile screen name must reject-and-log, not throw
 * inside the navigator. Keep in sync with RootStackParamList.
 */
export const NAVIGABLE_SCREENS: ReadonlySet<string> = new Set([
  'HomeSDUI',
  'HomeStatic',
  'CarDetails',
  'PerfBenchmark',
]);
