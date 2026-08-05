# PERF.md — Static vs SDUI Benchmark

## Honesty note, first

An earlier draft of this project reported timing numbers for phases the code never measured (TTI, frame drops, memory) and used hardcoded fallback values in the benchmark screen. That code is gone. Every number this document reports comes from `src/sdui/utils/perf.ts`, which records a phase **only when it actually happens**; the in-app benchmark screen shows "not measured" until then. The table below was transcribed from the app's own 📊 Compare screen running the release build on a physical device (screenshots captured over adb during the run).

## Methodology

**Both screens use the same measurement hooks** (`useScreenTimings`), the same leaf components, and mirror each other section-for-section (same cars, same images). The delta is therefore the engine, not content.

| Metric | Exactly what is measured |
|---|---|
| **JSON parse** | `JSON.parse()` of the payload **string**. The mock server serves a serialized string precisely so this cost is real — a Metro-imported `.json` is parsed at build time and any "parse time" measured on it would be fiction. |
| **Schema prep** | Version gate + node count walk before React sees the tree. |
| **TTR** | First line of the screen component's first render → the root `View`'s `onLayout` (RN has laid out above-the-fold content). Not "setState was called" — the earlier draft measured that, which is ~0ms and meaningless. |
| **TTI** | First render → the next JS macrotask after root layout, i.e. the first moment the JS thread could process a tap. |
| **Full page** | First render → `onLayout` of a sentinel view placed after the last section. |
| **Scroll perf** | `requestAnimationFrame` delta sampler over a 5s window while scrolling (tap **🎞 5s frames**, scroll continuously). Reports fps, frames >1.5× the 16.67ms budget ("drops"), and worst single frame. |

### Reproduction protocol

0. Set `MOCK_NETWORK_LATENCY_MS = 0` in `src/sdui/server/mockServer.ts`. It defaults to 400ms so the skeleton-loader states are visible in the demo video, and TTR/TTI are measured from screen mount — leaving it on would add the artificial delay to every SDUI number.
1. Build **release**: `npx react-native run-android --mode release` (Hermes on).
2. Cold-start the app → SDUI home measures itself → tap **🎞 5s frames** and scroll the full page for 5s.
3. **📊 Compare → Open Static ↗** → static screen measures itself → repeat the frame sampling there.
4. Return to **📊 Compare**; every cell is now populated from measurements. Copy them here.
5. Force-stop and repeat ×3; report the median. First-launch-after-install is discarded (JIT/pipeline warmup skews it).

Caveat recorded up front: `startAt` is the screen component's first render, not process start, so native app-startup cost (identical for both variants) is excluded by design — this isolates the page-level cost, which is the thing SDUI changes.

## Results — Moto G45 5G, release build, median of 3 cold opens

- **Device:** Motorola Moto G45 5G (720×1600 @ 120 Hz), Android, release APK, Hermes, `MOCK_NETWORK_LATENCY_MS = 0`
- **Cold-open fairness:** each variant was measured **as the app's launch screen** (two builds differing only in `initialRouteName`), because a screen navigated to mid-session mounts into a warm app and measures ~3× faster than a true cold open — see "what we almost got wrong" below.
- First launch after each install discarded (JIT warm-up); values are medians of the next 3 cold opens.

| Metric | Static | SDUI | Overhead |
|---|---|---|---|
| JSON parse | n/a | 0.3 ms | — |
| Schema prep | n/a | 0.1 ms | — |
| TTR (above fold) | 237.7 ms | 280.8 ms | **+43.1 ms (+18%)** |
| TTI (tappable) | 351.6 ms | 383.8 ms | **+32.2 ms (+9%)** |
| Full page | 238.0 ms | 281.0 ms | **+43.0 ms (+18%)** |
| Scroll (5s continuous) | 119.3 fps · 0 dropped · worst 15 ms | 119.1 fps · 0 dropped · worst 23 ms | ~0 |
| Node count | — | 25 top-level+child nodes | — |

Raw rounds (ms), for variance honesty:

| Round | Static TTR / TTI / Full | SDUI TTR / TTI / Full |
|---|---|---|
| 1 | 198.0 / 351.6 / 198.4 | 280.8 / 383.8 / 281.0 |
| 2 | 237.7 / 353.1 / 238.0 | 287.1 / 396.1 / 287.5 |
| 3 | 289.7 / 326.1 / 289.9 | 257.8 / 376.7 / 258.2 |

Notes on the numbers:
- **Parse + prep is 0.4 ms of the 43 ms TTR overhead** — the JSON pipeline is effectively free at this payload size. The remaining ~42 ms is the per-node wrapper components, binding/condition resolution, and the payload fetch effect forcing a second render pass on mount (static renders its content in the very first pass).
- **Scroll is identical** — both run at the panel's 120 Hz with zero dropped frames (sampler budget is 60 Hz-based, so "drops" = frames over 25 ms; SDUI's worst frame was 23 ms, static's 15 ms).
- **Cold-open variance on this device is real** (static TTR ranged 198–290 ms across runs) — single-run comparisons on budget hardware would be noise; medians of 3 was the minimum honest protocol.

### What we almost got wrong (and the brief would have caught)

The first measurement pass navigated to the static screen **mid-session** and recorded TTR 81.4 ms vs SDUI's cold 280.8 ms — an apparent **+245 % overhead**. That comparison was invalid: the brief defines both metrics from *cold open*, and a warm-mounted screen skips app init, image pipeline warm-up, and first-render costs that both variants pay on a real launch. Re-measured with each variant as the launch screen, the honest overhead is **+18 % TTR / +9 % TTI**. Both numbers are reported here deliberately — the invalid one is exactly the kind of flattering-to-static (or, reversed, flattering-to-SDUI) mistake this methodology section exists to prevent.

## Measure → optimize loop (what was tried)

**Round 1 — found: every state change re-rendered the whole tree.**
Chip selection triggers a context update; every `SDUINodeView` subscribes to state (it must, for bindings), so all ~60 wrappers re-ran. *Fix:* two changes — (a) `resolveValue` returns the **same object reference** when a node's props contain no bindings, and (b) every leaf component is `React.memo`. Result: a chip tap re-renders the node wrappers (cheap prop resolution) but only remounts/re-renders the components whose resolved props actually changed (the chips row + cards whose visibility flipped). Verified with React DevTools highlight-updates.

**What didn't work at first:** naively memoizing the per-node callback functions — caching closures leaked stale `{state, item}` scope into `{{event}}` resolution. First shipped with per-render callbacks (documented as a trade-off); later solved properly with the **latest-ref pattern**: each slot's callback identity is a stable ref created once per node, and its body reads the freshest slots/scope/dispatch from a mutable ref at call time. Interactive nodes now keep `React.memo` hits without stale-state risk.

**Round 2 — found: unknown-type fallback remounted every render.**
The original registry returned a **fresh function component** for unknown types on each lookup — a new element type each render, so React unmounted/remounted the fallback continuously (visible as flicker with highlight-updates on). *Fix:* registry returns `undefined`; the renderer owns a single stable `UnsupportedNode` component.

**Round 3 — parse honesty.**
Initial code measured `JSON.parse(JSON.stringify(importedJson))` — a round-trip of an already-parsed object, timing the wrong thing. Moved serialization to the mock server so the client pays and measures a genuine string parse.

**Deliberately not done:** FlatList virtualization of the page body (60 nodes doesn't earn it — see README trade-offs); precompiling payloads to a binary format (parse is a single-digit-ms cost at this size; complexity not earned).

## Expectation vs reality

SDUI's structural overhead here is: string parse + schema walk + per-node prop/condition resolution + one wrapper component per node. All are O(nodes) with small constants; at 60 nodes the dominant cost on both screens remains RN layout + image decode, which is identical for both. That is the *expected* shape — the recorded table above is what confirms or refutes it, and the honest answer lives there, not here.
