import type { Condition, CompositeCondition, LeafCondition } from '../types/schema';

/** Reads `"a.b.c"` out of a plain object without throwing on missing links. */
export function readPath(source: unknown, path: string): unknown {
  if (!path) return undefined;
  let cursor: unknown = source;
  for (const segment of path.split('.')) {
    if (cursor === null || typeof cursor !== 'object') return undefined;
    cursor = (cursor as Record<string, unknown>)[segment];
  }
  return cursor;
}

function isComposite(condition: Condition): condition is CompositeCondition {
  return 'all' in condition || 'any' in condition || 'not' in condition;
}

/**
 * Evaluates a JSON condition against runtime state.
 *
 * Unknown or malformed conditions resolve to `true` — a server sending a
 * condition shape this client version does not understand should show the
 * content, not silently blank the section.
 */
export function evaluateCondition(
  condition: Condition | undefined,
  state: Record<string, unknown>,
): boolean {
  if (!condition || typeof condition !== 'object') return true;

  if (isComposite(condition)) {
    // All present clauses must hold (they AND together) — a payload combining
    // `all` + `any` in one object gets both evaluated, not a silent ignore.
    if (condition.all && !condition.all.every(child => evaluateCondition(child, state))) {
      return false;
    }
    if (condition.any && !condition.any.some(child => evaluateCondition(child, state))) {
      return false;
    }
    if (condition.not && evaluateCondition(condition.not, state)) {
      return false;
    }
    return true;
  }

  const leaf = condition as LeafCondition;
  if (typeof leaf.stateKey !== 'string') return true;

  const value = readPath(state, leaf.stateKey);

  if ('equals' in leaf && value !== leaf.equals) return false;
  if ('notEquals' in leaf && value === leaf.notEquals) return false;

  if (Array.isArray(leaf.oneOf) && !leaf.oneOf.includes(value)) return false;

  if ('contains' in leaf) {
    if (Array.isArray(value)) {
      if (!value.includes(leaf.contains)) return false;
    } else if (typeof value === 'string') {
      if (!value.includes(String(leaf.contains))) return false;
    } else {
      return false;
    }
  }

  if ('exists' in leaf) {
    const present = value !== undefined && value !== null;
    if (present !== leaf.exists) return false;
  }

  if (typeof leaf.gt === 'number' && !(Number(value) > leaf.gt)) return false;
  if (typeof leaf.lt === 'number' && !(Number(value) < leaf.lt)) return false;

  return true;
}
