import { useCallback, useRef } from 'react';
import { perfStore, now } from './perf';

/**
 * Shared measurement harness used by BOTH the static and the SDUI screen, so
 * the comparison in PERF.md is apples-to-apples by construction:
 *
 *   startAt   — captured on the first render pass of the screen component
 *   TTR       — startAt → root <View onLayout>
 *   TTI       — startAt → next JS macrotask after layout (thread free = tappable)
 *   fullPage  — startAt → onLayout of the last section in the scroll content
 */
export function useScreenTimings(name: string) {
  const started = useRef(false);
  if (!started.current) {
    started.current = true;
    perfStore.begin(name);
  }

  const onRootLayout = useCallback(() => {
    const record = perfStore.screen(name);
    if (!record || record.ttrMs !== undefined) return;
    const ttrMs = now() - record.startAt;
    perfStore.mark(name, { ttrMs });
    // TTI: the moment the JS thread next comes up for air after first layout.
    setTimeout(() => {
      const fresh = perfStore.screen(name);
      if (fresh && fresh.ttiMs === undefined) {
        perfStore.mark(name, { ttiMs: now() - fresh.startAt });
      }
    }, 0);
  }, [name]);

  const onLastSectionLayout = useCallback(() => {
    const record = perfStore.screen(name);
    if (!record || record.fullPageMs !== undefined) return;
    perfStore.mark(name, { fullPageMs: now() - record.startAt });
  }, [name]);

  return { onRootLayout, onLastSectionLayout };
}
