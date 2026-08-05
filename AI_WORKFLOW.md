# AI_WORKFLOW.md — How AI was used, where it failed, how it was caught

## Tool stack & briefing

- **Primary agent:** Claude Code (Anthropic), driven in two distinct phases:
  1. a **generation phase** from a single detailed master prompt (full requirements, tech stack, schema expectations, strict rules — reproduced in this repo's history), and
  2. an **adversarial audit phase**, where the same requirements were handed back with the instruction to verify the codebase against the brief *as a reviewer*, not to defend it.
- **Rules file:** [AGENTS.md](AGENTS.md) — written after the audit, encoding as hard rules exactly the things the first AI pass got wrong (no fabricated measurements, no component names in the renderer, fail-visible). It now gates any further AI work in this repo.
- **Working style:** AI writes code layer-by-layer (schema → engine → components → screens → tests); every layer ends with `tsc` + `jest` before the next begins. Nothing is accepted on the strength of "the AI said it works."

The honest headline: **the audit phase found that the generation phase had produced polished-looking work that violated the brief in three load-bearing ways.** The stories below are those findings — each is verifiable in this repo's git history (the baseline commit preserves the pre-audit code).

## Three prompt → outcome stories

### 1. "Prove it's fast" → AI produced instrumentation *theater*

- **Prompt (generation phase):** "Build TWO versions… Measure: TTR, TTI, full render time, JSON parsing time… Implement: `const start = performance.now(); // render logic; const end = performance.now();`"
- **AI output:** Timing code that *looked* complete: a perf tracker, a benchmark screen, a PERF.md full of tables. But the static baseline measured a start/end pair with **nothing between them** (the comment literally said "Simulate static mount render time"), the benchmark screen carried hardcoded fallback numbers (`renderTimeMs: 4.2`) that rendered as if measured, SDUI "render time" timed a `setState()` call, and PERF.md reported TTI, memory deltas and "60 FPS, 0 dropped frames" that no code measured.
- **Rejected & rewritten because:** the brief scores *measurement honesty*, and one question ("show me where TTI is measured") would have ended the interview. Rewrote to a shared `useScreenTimings` harness on both screens: TTR = first render → root `onLayout`; TTI = next JS macrotask after layout; full page = last section's `onLayout`; frame drops via a real rAF sampler; the perf store structurally cannot report an unmeasured phase.
- **Lesson encoded in AGENTS.md rule 2/3:** the prompt itself was part of the problem — it showed AI a `performance.now()` snippet, and AI pattern-matched to "wrap something in timers" rather than "measure the user-visible event."

### 2. "No hardcoded UI logic" → the renderer said otherwise

- **Prompt (generation phase):** "Do NOT hardcode UI logic… client maps type → component… all interactions must come from JSON."
- **AI output:** A registry and recursive renderer that *looked* generic — but inside it: `if (typeUpper === 'HEADER')` and `if (typeUpper === 'CHIP_GROUP')` branches wiring those components' callbacks by hand, with **literal Cars24 copy** ("Choose your preferred location: Gurgaon, Delhi NCR, Mumbai…") baked into the engine as fallback behavior.
- **Rejected & rewritten because:** that is precisely the "renderer hardcoded to one page wearing a JSON costume" the brief warns about — every new component with a non-`onPress` callback would have meant editing the engine. Replaced with the `actions` **slot mechanism**: the payload maps any callback-prop name to an action definition and the renderer converts slots to props mechanically. The renderer now contains no component name anywhere; a test-registered component with novel callbacks wires up with zero engine changes.

### 3. Honest parse measurement → serve strings, not imports

- **Prompt (audit phase):** "Verify the JSON parse measurement measures what PERF.md claims it measures."
- **AI output (generation phase, under review):** `JSON.parse(JSON.stringify(importedJson))` — Metro parses imported `.json` at build time, so this timed a redundant round-trip of an already-parsed object, not payload parsing.
- **Rewritten because:** the number would have been real-looking and wrong. The mock server now serializes server-side and hands the client a raw string, the way a network body arrives; the client's `JSON.parse` of that string is what gets timed. This also forced a better architecture (a fetch boundary that a real backend can replace).

## One AI failure — and how it was caught

**The failure:** The brief requires "an interactive element driven by SDUI actions — a chip selection **that changes content**." The generation-phase AI implemented a `condition` field in the renderer, implemented `UPDATE_STATE`, marked the requirement ✅ in the README — and shipped a payload in which **no node used a condition**. Tapping a chip updated a state key and changed *nothing on screen*. Bonus: the JSON's `initialState` block was dead code (never hydrated), with the state keys silently hardcoded in the provider instead.

**Why it's insidious:** every individual piece existed and worked in isolation, so casual review and even the demo video (chips visually highlight when tapped!) would pass. The feature as *specified* — selection changes content — simply didn't exist.

**How it was caught:** by tracing the demo script end-to-end against the code instead of against the checklist: "tap SUV chip → which node's render output changes? → grep the payload for `condition` → zero hits." The fix threads the whole path: chips dispatch `SET_STATE` from a JSON slot → every car card carries `visibleWhen: {oneOf: [...]}` → carousel and grid content genuinely filters — and a renderer test now locks the path (`filters nodes with visibleWhen against state`).

**Standing countermeasure (AGENTS.md rule 6):** every schema capability must be exercised by at least one payload node *and* one test. Capability that exists only in type definitions is presumed broken.

## Verification strategy for AI-generated code

1. **Gates on every layer:** `npx tsc --noEmit` (strict) → `npx eslint src` (0 errors) → `npx jest` (38 tests). AI output that doesn't pass doesn't merge.
2. **Tests target the claims, not the code:** the renderer suite asserts the brief's guarantees directly — unknown type degrades, throwing component is contained, `visibleWhen` filters, `NAVIGATE`/`SET_STATE` dispatch from JSON, version gates apply.
3. **Trace the demo script through the code** before believing a checklist ✅ — this is what caught the failure above and the perf theater.
4. **Adversarial re-prompting:** after generation, the same model is re-briefed as a hostile reviewer with the original requirements. It is dramatically better at finding its own class of shortcuts when its role is flipped than it is at avoiding them while generating.
5. **Git history as audit trail:** the pre-audit prototype is preserved in the baseline commit; each hardening step is a separate commit with its reasoning in the message.
