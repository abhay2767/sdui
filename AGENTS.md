# AI Context & Rules — Cars24 SDUI Assignment

This file briefs any AI coding agent working in this repo. It encodes the
non-negotiables that earlier AI output violated; treat every rule as a review
gate, not a suggestion.

## Project

React Native 0.86 + TypeScript strict. An SDUI engine renders pages from JSON
served by `src/sdui/server/mockServer.ts`. Screens live in `src/screens`,
engine in `src/sdui`. Tests: `npx jest`. Types: `npx tsc --noEmit`.

## Hard rules

1. **The renderer must contain zero component-name knowledge.** No
   `if (type === 'HEADER')` anywhere in `src/sdui/renderer` or
   `src/sdui/context`. Component-specific wiring goes through the `actions`
   slot mechanism or into the component itself.
2. **Never fabricate a measurement.** No default/fallback timing values, no
   "simulated" phases, no reporting a metric the code doesn't record. A
   missing measurement renders as "not measured". If asked to produce a perf
   number, produce the *instrumentation* and say the number must come from a
   device run.
3. **Measure the real thing.** "Render time" means layout callbacks
   (`onLayout`), not `setState` duration. "Parse time" means parsing a string,
   not re-parsing a Metro-imported object.
4. **Fail visible, not silent.** Unknown types, version-gated nodes, and
   throwing components must render a placeholder and log — never `return null`
   silently, never crash the page.
5. **No screen-specific state in the engine.** All state keys originate from
   payload `initialState` or navigation params.
6. **Every schema capability must be exercised** by at least one payload node
   and one test. A feature that exists only in the type definitions is
   presumed broken.
7. Match existing code style; strict TS (no `any` in engine code); components
   are `React.memo` function components.

## Definition of done for any change

`npx tsc --noEmit` clean → `npx eslint src` 0 errors → `npx jest` green →
if the change touches the engine, a test exercises the new path.
