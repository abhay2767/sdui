# 🤖 AI_WORKFLOW.md — AI Engineering Strategy & Audit Trail

> **Assessment Weight: 30%** — How AI was briefed, leveraged, critiqued, and verified throughout the assignment.

---

## 1. Tool Stack & Context Briefing Strategy

### AI Tool Stack:
- **Primary AI Agent**: Antigravity AI Pair Programmer (DeepMind Advanced Coding Assistant)
- **Models Used**: Gemini 3.6 Flash & GPT-OSS 120B
- **Environment Rules & Context**: Custom workspace context rules configured in `AGENTS.md` and TypeScript strict mode constraints.

### How AI Was Briefed:
Rather than asking AI for one giant "write everything" dump, the project was broken down into a **layered architectural blueprint**:
1. Schema & TypeScript Data Models
2. Registry & Recursive Component Renderer
3. Reusable UI Component Library
4. Context & Action Dispatcher
5. Performance Benchmark Instrumentation

---

## 2. Three Prompt → Outcome Stories

### Story 1: Schema & Action System Architecture
- **Real Prompt**: *"Design a platform-agnostic, extensible TypeScript schema for an SDUI system supporting nested children, conditional rendering based on local state keys, versioning, and declarative actions."*
- **AI Output**: Proposed `SDUINode` with dynamic action definitions and style props.
- **What Was Rewritten/Rejected & Why**: 
  - *Rejected*: AI initially proposed raw string CSS styles (e.g. `"style": "padding: 10px; flex-direction: row"`).
  - *Why*: String parsing CSS at runtime in React Native creates heavy string-split overhead during render passes. Rewrote it to strongly typed `SDUINodeStyle` objects matching React Native `StyleSheet` properties.

---

### Story 2: Component Registry & Fallback Handling
- **Real Prompt**: *"Build a component registry map and recursive renderer function. If an unknown component type is encountered in JSON, render a fallback UI without crashing the app."*
- **AI Output**: Generated `getComponentForType(type)` function returning a warning card.
- **What Was Rewritten/Rejected & Why**:
  - *Rejected*: AI originally used standard `console.error` and returned `null` for unknown component nodes.
  - *Why*: Returning `null` hides missing widgets silently from developers and users. Rewrote to render an explicit visual `FallbackComponent` with diagnostic border styling while routing telemetry to `SDUILogger`.

---

### Story 3: Sticky Bottom CTA & Safe Area Inset Protection
- **Real Prompt**: *"Refactor CarDetailsScreen so the 'Book Free Test Drive' button is pinned fixed at the bottom of the screen without getting cut off by Android 3-button system navigation bar or iOS Home Indicator."*
- **AI Output**: Positioned button inside `<ScrollView>` with `marginTop: 'auto'`.
- **What Was Rewritten/Rejected & Why**:
  - *Rejected*: Placing `marginTop: 'auto'` inside a `<ScrollView>` caused the button to float in the middle of short screens when content didn't fill the device height.
  - *Why*: In React Native `<ScrollView>`, children expand to content height. Rewrote layout to use `position: 'absolute', bottom: 0` with `useSafeAreaInsets()` dynamic bottom inset padding (`Math.max(insets.bottom, 12)`).

---

## 3. One AI Failure Case & How It Was Caught

### Encountered AI Failure:
During interactive question prompt execution, AI invoked `ask_question` tool with an empty `options: []` array for text inputs:
`Error Message: model output error: invalid tool call error (invalid_args) each question requires at least 2 options`.

### Root Cause Analysis:
The system tool schema strictly requires at least 2 selectable options per question.

### How It Was Caught & Corrected:
1. Observed exact system diagnostic traceback in log window.
2. Identified that text questions must supply fallback option choices `["(Enter URL)", "(Cancel)"]`.
3. Corrected tool invocation parameters immediately, restoring seamless pipeline execution.

---

## 4. Verification Strategy for AI-Generated Code

Every piece of AI-generated code underwent strict 4-step verification:

1. **Static Type Checking**: `npx tsc --noEmit` executed after every major edit to ensure strict TypeScript compliance and zero type leaks.
2. **Runtime Fallback Testing**: Injected synthetic unknown node `"type": "FUTURE_CAR_SCANNER_WIDGET"` into `homeSDUI.json` to verify non-crashing graceful degradation.
3. **Action Execution Test**: Tested `NAVIGATE` intent to `CarDetailsScreen`, `OPEN_BOTTOM_SHEET` modal popups, and `UPDATE_STATE` chip selections.
4. **Empirical Performance Profiling**: Verified 60 FPS scroll performance and recorded exact TTR/TTI overhead in `PERF.md`.
