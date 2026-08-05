import type { BindingScope } from '../types/schema';
import { readPath } from './conditions';

/**
 * Binding syntax: `{{scope.path}}` inside any string value.
 *
 *   "₹{{state.emiAmount}}/month"     → interpolated into the surrounding text
 *   "{{state.selectedCategory}}"     → returns the raw value, type preserved
 *   "{{item.price}}" / "{{event.id}}"
 *
 * Deliberately not a general expression language. Anything that needs real
 * logic belongs on the server, where it can be changed without a release —
 * shipping an evaluator to the client would put logic back in the binary,
 * which is the thing SDUI exists to avoid.
 */
const BINDING_PATTERN = /\{\{\s*([a-zA-Z0-9_$.]+)\s*\}\}/g;
const WHOLE_BINDING = /^\{\{\s*([a-zA-Z0-9_$.]+)\s*\}\}$/;
/**
 * Membership test: `{{state.wishlist contains car_1}}` → boolean.
 * The one operator the binding grammar carries beyond value lookup — it is
 * presentation state (is this id selected/wishlisted?), not business logic,
 * so it belongs client-side. Whole-string form only.
 */
const CONTAINS_BINDING = /^\{\{\s*([a-zA-Z0-9_$.]+)\s+contains\s+(.+?)\s*\}\}$/;

/** True when a string contains at least one binding expression. */
export function hasBinding(value: unknown): boolean {
  return typeof value === 'string' && value.includes('{{');
}

function lookup(path: string, scope: BindingScope): unknown {
  const dot = path.indexOf('.');
  const root = dot === -1 ? path : path.slice(0, dot);
  const rest = dot === -1 ? '' : path.slice(dot + 1);

  let base: unknown;
  switch (root) {
    case 'state':
      base = scope.state;
      break;
    case 'item':
      base = scope.item;
      break;
    case 'event':
      base = scope.event;
      break;
    default:
      // Bare paths default to state, so `{{selectedCategory}}` also works.
      return readPath(scope.state, path);
  }
  return rest ? readPath(base, rest) : base;
}

/** Resolves a single string. Whole-string bindings keep their original type. */
export function resolveString(value: string, scope: BindingScope): unknown {
  const membership = value.match(CONTAINS_BINDING);
  if (membership) {
    const container = lookup(membership[1], scope);
    const needle = membership[2];
    if (Array.isArray(container)) return container.includes(needle);
    if (typeof container === 'string') return container.includes(needle);
    return false;
  }

  const whole = value.match(WHOLE_BINDING);
  if (whole) return lookup(whole[1], scope);

  return value.replace(BINDING_PATTERN, (_match, path: string) => {
    const resolved = lookup(path, scope);
    return resolved === undefined || resolved === null ? '' : String(resolved);
  });
}

/**
 * Deep-resolves bindings in any value. Returns the *same reference* when
 * nothing needed resolving, so `React.memo` on rendered components still hits.
 */
export function resolveValue<T>(value: T, scope: BindingScope): T {
  if (typeof value === 'string') {
    return (hasBinding(value) ? resolveString(value, scope) : value) as T;
  }

  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map(entry => {
      const resolved = resolveValue(entry, scope);
      if (resolved !== entry) changed = true;
      return resolved;
    });
    return (changed ? next : value) as T;
  }

  if (value && typeof value === 'object') {
    let changed = false;
    const next: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      const resolved = resolveValue(entry, scope);
      if (resolved !== entry) changed = true;
      next[key] = resolved;
    }
    return (changed ? next : value) as T;
  }

  return value;
}

/**
 * Resolves `"$color.primary"` style tokens against the page theme.
 * Unknown tokens are dropped rather than passed through, so a stale token
 * never reaches RN's style validator as a literal `"$color.primary"` string.
 */
export function resolveStyleTokens(
  style: Record<string, unknown> | undefined,
  theme: Record<string, Record<string, unknown>> | undefined,
): Record<string, unknown> | undefined {
  if (!style) return undefined;
  if (!theme) return style;

  let changed = false;
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(style)) {
    if (typeof value === 'string' && value.startsWith('$')) {
      const resolved = readPath(theme, value.slice(1));
      if (resolved !== undefined) {
        next[key] = resolved;
        changed = true;
        continue;
      }
      changed = true; // drop unknown token
      continue;
    }
    next[key] = value;
  }
  return changed ? next : style;
}
