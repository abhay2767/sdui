/**
 * SDUI Schema — the contract between server and client.
 *
 * Design rules this schema is built to satisfy:
 *  1. The renderer must never need to know a component's *name* to wire it up.
 *     Everything screen-specific lives in JSON; the engine only knows structure.
 *  2. A payload written for a newer client must degrade, never crash, on an
 *     older one (`minVersion` + `fallback`).
 *  3. Values that depend on runtime state are expressed as binding strings,
 *     so a section can react to a chip tap without any client code.
 */

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export type ActionType =
  | 'NAVIGATE'
  | 'NAVIGATE_BACK'
  | 'OPEN_BOTTOM_SHEET'
  | 'CLOSE_BOTTOM_SHEET'
  | 'API_CALL'
  | 'SET_STATE'
  | 'TOGGLE_IN_LIST'
  | 'OPEN_URL'
  | 'LOG';

export interface ActionDefinition {
  type: ActionType;
  /**
   * Payload values may contain binding expressions, resolved at dispatch time
   * against `{ state, item, event }`. e.g. `"value": "{{event.id}}"`.
   */
  payload?: Record<string, unknown>;
  /** Optional chain: run these after the current action resolves. */
  then?: ActionDefinition[];
}

/**
 * Named callback slots. The renderer turns each key into a prop of the same
 * name holding a dispatcher function.
 *
 *   "actions": { "onPress": {...}, "onLocationPress": {...} }
 *
 * becomes  <Header onPress={fn} onLocationPress={fn} />
 *
 * This is what removes per-component `if (type === 'HEADER')` branches from the
 * engine: a component declares which callback props it accepts, and the server
 * fills whichever ones it wants.
 */
export type ActionSlots = Record<string, ActionDefinition | ActionDefinition[]>;

// ---------------------------------------------------------------------------
// Conditions
// ---------------------------------------------------------------------------

export interface LeafCondition {
  /** Dot path into runtime state, e.g. `"selectedCategory"` or `"filters.fuel"`. */
  stateKey: string;
  equals?: unknown;
  notEquals?: unknown;
  /** True when state value is one of these. */
  oneOf?: unknown[];
  /** True when the state value (array or string) contains this. */
  contains?: unknown;
  /** True when value is non-null/non-undefined (or the inverse). */
  exists?: boolean;
  gt?: number;
  lt?: number;
}

export interface CompositeCondition {
  all?: Condition[];
  any?: Condition[];
  not?: Condition;
}

export type Condition = LeafCondition | CompositeCondition;

// ---------------------------------------------------------------------------
// Style
// ---------------------------------------------------------------------------

/**
 * Deliberately an object of RN style keys rather than a CSS string — string
 * parsing costs measurable time on every render pass, and an object survives
 * `StyleSheet.flatten` for free. Values may reference theme tokens as
 * `"$color.primary"`.
 */
export interface SDUIStyle {
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Node
// ---------------------------------------------------------------------------

export interface SDUINode {
  /** Stable identity. Used as the React key; keep it unique per page. */
  id?: string;
  /** Registry key. Unknown values render the fallback, never crash. */
  type: string;
  props?: Record<string, unknown>;
  style?: SDUIStyle;

  /** Shorthand for `actions.onPress`. */
  action?: ActionDefinition | ActionDefinition[];
  actions?: ActionSlots;

  children?: SDUINode[];

  /** Render only when this evaluates true against runtime state. */
  visibleWhen?: Condition;

  /**
   * Minimum client schema version required to render this node. Clients below
   * it render `fallback` (or the generic unsupported placeholder) instead of
   * attempting to render something they only half-understand.
   */
  minVersion?: string;

  /** Rendered in this node's place when it cannot be rendered. */
  fallback?: SDUINode;

  /**
   * Data-driven repetition: render `template` once per entry in this array
   * (or per entry of the state array named by `forEachStateKey`). Inside the
   * template, `{{item.foo}}` resolves against the current entry.
   */
  forEach?: Record<string, unknown>[];
  forEachStateKey?: string;
  template?: SDUINode;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export interface SDUIPageSchema {
  /** Schema version this payload is authored against, e.g. "1.2". */
  version: string;
  pageId: string;
  title?: string;
  meta?: {
    author?: string;
    updatedAt?: string;
    experiment?: string;
  };
  /** Seeds runtime state. The engine holds no screen-specific defaults. */
  initialState?: Record<string, unknown>;
  /** Named values referenced from styles as `"$color.primary"`. */
  theme?: Record<string, Record<string, unknown>>;
  page: SDUINode[];
}

/** Context available to binding expressions during a render. */
export interface BindingScope {
  state: Record<string, unknown>;
  item?: Record<string, unknown>;
  event?: unknown;
}
