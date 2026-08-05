# COVERAGE.md — What renders from JSON alone

## Component registry (23 types)

**Layout primitives:** `ROW` · `COLUMN` · `CARD` · `CONTAINER` · `DIVIDER` · `SPACER`
**Content primitives:** `TEXT` (7 typography variants) · `IMAGE` · `BUTTON` · `BADGE` · `KEY_VALUE_ROW` · `STAT_TILE` · `RATING` · `PROGRESS_BAR` · `LIST_ITEM` · `CHECK_ROW`
**Interactive primitives:** `CHIP_GROUP` · `SEGMENTED_CONTROL`
**Cars24 composites:** `HEADER` · `BANNER` · `CAR_CARD` · `CAROUSEL` · `GRID`

Every composite is expressible in primitives; composites exist as hand-tuned fast paths for high-traffic sections, not as requirements.

## Patterns the schema expresses (all JSON-only)

| Pattern | Mechanism |
|---|---|
| Vertical stacks / sections | `COLUMN`, `children` |
| Horizontal rails | `CAROUSEL` (snap scrolling) or `ROW` |
| N-column grids | `GRID` with `columns`/`gap` |
| Data-driven repetition | `forEach` (inline data) / `forEachStateKey` (state array) + `template`, `{{item.*}}` bindings |
| Conditional visibility | `visibleWhen` with `equals/notEquals/oneOf/contains/exists/gt/lt` + `all/any/not` |
| Selection driving content | bound prop (`"selected": "{{state.k}}"`) + `SET_STATE` slot → other nodes' `visibleWhen`/bindings react |
| Taps → navigation | `NAVIGATE` with params (params can carry whole objects into the next page's binding scope) |
| Bottom sheets with arbitrary content | `OPEN_BOTTOM_SHEET` whose `body` is an SDUI node tree |
| Action sequencing | `then` chains (e.g. select city → close sheet) |
| Text/value interpolation | `{{state.*}} / {{item.*}} / {{event.*}}` |
| Membership / selection display | `{{state.wishlist contains car_1}}` → boolean prop (wishlist hearts, multi-select chips) |
| Styling overrides | per-node `style` (RN keys) + `$token` theme references |
| Progressive rollout / mixed fleets | per-node `minVersion` + server-defined `fallback` |

## Honest coverage claim

> **Given a new Cars24 screen, I estimate ~80–85% of its sections render with JSON-only changes.** Content sections (headers, lists, spec tables, checklists, banners, CTAs, pickers, tab-filtered content) are fully covered by the vocabulary above. The remainder splits into "new leaf component, fast" and "engine work, slower" — itemized below, because a one-number claim hides where the time actually goes.

Basis for the number: the Car Details page was authored *after* the engine was frozen and needed zero new components — every section (hero, stats, EMI selector, inspection checklist, progress score, CTA) came from the existing registry. That's one data point, not proof; the surprise screen is the real test.

### 🟢 JSON-only (no client changes)

Headers, text of any hierarchy, images, badges, buttons, key-value/spec tables, checklists, ratings, progress bars, stat rows, list menus, chip filters with content that reacts, segmented selectors, sheets, banners, carousels, grids, section reordering, styling changes, A/B variants via `visibleWhen`.

### 🟡 New leaf component (fast — register + build one file)

Examples: video player block, map snippet, OTP input, image-comparison slider. Cost shape: one component file + one registry line; **no renderer, schema, or action changes** (action slots and bindings compose automatically). The `RATING` primitive was added this way to validate the path: component + registry line, usable from JSON immediately.

### 🔴 Engine or native work (slower, and honestly outside JSON)

- **Forms with validation** — needs a `SUBMIT_FORM` action + field-state conventions (engine work, ~half a day).
- **Virtualized infinite feeds** — needs a `LIST` type backed by FlatList + a pagination action (engine work; the schema already expresses the repetition, the renderer needs the virtualization path).
- **Native SDK surfaces** — payments, AR/3D viewers, camera flows. These are native modules behind a registered component at best; their internals are not servable as JSON and shouldn't be.

## The surprise-screen playbook (how I'd work live)

1. Sketch the screen as sections; map each to registry types (most map to primitives immediately).
2. Author JSON top-down, `initialState` first, binding any interactive values.
3. Anything unknown: drop the intended `type` into the payload anyway — it degrades visibly via `UnsupportedNode`, the page stays alive, and the placeholder becomes the to-do list.
4. For each placeholder: build the leaf component, add one registry line, reload — the JSON already written starts rendering.
