/**
 * Performance instrumentation.
 *
 * Ground rules, because the numbers in PERF.md come from here:
 *  - A metric only exists once its phase has actually happened. There are no
 *    defaults and no fabricated fallbacks anywhere in this module.
 *  - "Rendered" means the root view's onLayout fired — i.e. RN has laid the
 *    tree out on screen — not "setState was called".
 *  - TTI is approximated as the first moment the JS thread is free after
 *    layout (a `setTimeout(0)` turn), which is when a tap could actually be
 *    processed.
 */

export function now(): number {
  const perf = (globalThis as { performance?: { now(): number } }).performance;
  return perf?.now ? perf.now() : Date.now();
}

export interface ScreenTimings {
  /** Screen key, e.g. "SDUI_HOME" | "STATIC_HOME". */
  name: string;
  /** JS entry: first line of the screen component's first render. */
  startAt: number;
  /** SDUI only: milliseconds spent in JSON.parse of the payload string. */
  parseMs?: number;
  /** SDUI only: schema walk + node prep before React rendering. */
  prepareMs?: number;
  /** First render → root onLayout. Above-the-fold content is visible. */
  ttrMs?: number;
  /** First render → JS thread idle after layout. Page responds to taps. */
  ttiMs?: number;
  /** First render → last section's onLayout. Everything is on screen. */
  fullPageMs?: number;
  nodeCount?: number;
  recordedAt?: string;
}

export interface FrameStats {
  /** Total frames observed while sampling. */
  frames: number;
  /** Duration of the sampling window in ms. */
  durationMs: number;
  /** Frames whose delta exceeded 1.5× the 16.67ms budget. */
  drops: number;
  /** Longest single frame in ms. */
  worstFrameMs: number;
  fps: number;
}

type Listener = () => void;

class PerfStore {
  private screens: Record<string, ScreenTimings> = {};
  private frameStats: Record<string, FrameStats> = {};
  private listeners: Listener[] = [];

  begin(name: string): ScreenTimings {
    // Keep the first cold-open measurement; re-mounts don't overwrite it
    // unless explicitly reset. Cold numbers are the honest ones.
    if (!this.screens[name]) {
      this.screens[name] = { name, startAt: now(), recordedAt: new Date().toISOString() };
      this.notify();
    }
    return this.screens[name];
  }

  /** Merge measured phases into a screen's record. Never invents values. */
  mark(name: string, phase: Partial<ScreenTimings>): void {
    const record = this.screens[name] ?? this.begin(name);
    Object.assign(record, phase);
    if (__DEV__) {
      const summary = Object.entries(phase)
        .filter(([, value]) => typeof value === 'number')
        .map(([key, value]) => `${key}=${(value as number).toFixed(1)}ms`)
        .join(' ');
      if (summary) console.log(`⚡ [PERF][${name}] ${summary}`);
    }
    this.notify();
  }

  reset(name?: string): void {
    if (name) {
      delete this.screens[name];
      delete this.frameStats[name];
    } else {
      this.screens = {};
      this.frameStats = {};
    }
    this.notify();
  }

  setFrameStats(name: string, stats: FrameStats): void {
    this.frameStats[name] = stats;
    this.notify();
  }

  screen(name: string): ScreenTimings | undefined {
    return this.screens[name];
  }

  frames(name: string): FrameStats | undefined {
    return this.frameStats[name];
  }

  all(): { screens: Record<string, ScreenTimings>; frames: Record<string, FrameStats> } {
    return { screens: { ...this.screens }, frames: { ...this.frameStats } };
  }

  subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(entry => entry !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(listener => listener());
  }
}

export const perfStore = new PerfStore();

/**
 * Samples frame deltas with requestAnimationFrame for `durationMs`, reporting
 * dropped frames (>1.5 frame budgets) and worst frame. Call while scrolling.
 */
export function sampleFrames(name: string, durationMs = 5000): Promise<FrameStats> {
  return new Promise(resolve => {
    const budget = 1000 / 60;
    const start = now();
    let last = start;
    let frames = 0;
    let drops = 0;
    let worst = 0;

    const tick = () => {
      const current = now();
      const delta = current - last;
      last = current;
      frames += 1;
      if (delta > budget * 1.5) drops += 1;
      if (delta > worst) worst = delta;

      if (current - start < durationMs) {
        requestAnimationFrame(tick);
      } else {
        const elapsed = current - start;
        const stats: FrameStats = {
          frames,
          durationMs: elapsed,
          drops,
          worstFrameMs: worst,
          fps: frames / (elapsed / 1000),
        };
        perfStore.setFrameStats(name, stats);
        resolve(stats);
      }
    };

    requestAnimationFrame(tick);
  });
}
