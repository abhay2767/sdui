import React, { createContext, useContext, useMemo, useRef } from 'react';
import type {
  ActionDefinition,
  BindingScope,
  SDUINode,
} from '../types/schema';
import { lookupComponent } from '../registry';
import { useSDUI } from '../context/SDUIContext';
import { evaluateCondition } from '../engine/conditions';
import { resolveValue, resolveStyleTokens } from '../engine/bindings';
import { isNodeSupported } from '../engine/versioning';
import { NodeErrorBoundary } from '../components/system/NodeErrorBoundary';
import { UnsupportedNode } from '../components/system/UnsupportedNode';

/**
 * Per-page context. Carries page-scoped, render-static data (currently the
 * style theme). Navigation deliberately does NOT live here — NAVIGATE goes
 * through the module-level navigationRef in the dispatcher, so actions work
 * identically in screens, bottom-sheet bodies, and any future portal.
 */
interface PageContextValue {
  theme?: Record<string, Record<string, unknown>>;
}

const PageContext = createContext<PageContextValue>({});

export const SDUIPageProvider: React.FC<PageContextValue & { children: React.ReactNode }> = ({
  theme,
  children,
}) => {
  const value = useMemo(() => ({ theme }), [theme]);
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
};

// ---------------------------------------------------------------------------
// Node rendering
// ---------------------------------------------------------------------------

interface NodeProps {
  node: SDUINode;
  /** Stable path-based key material, used for keys and telemetry. */
  path: string;
  /** Set when rendering inside a `forEach`, exposing `{{item.*}}`. */
  item?: Record<string, unknown>;
}

/**
 * Renders exactly one node.
 *
 * This function contains no knowledge of any component name. Everything a
 * component needs — props, styles, callbacks — is derived from the node's own
 * declarations. Adding a section type to the product means adding a file and a
 * registry line; it never means editing this file.
 */
const SDUINodeView: React.FC<NodeProps> = React.memo(({ node, path, item }) => {
  const { state, dispatch } = useSDUI();
  const { theme } = useContext(PageContext);

  const scope: BindingScope = useMemo(() => ({ state, item }), [state, item]);

  // Latest-ref pattern for action callbacks: the *identity* of each slot
  // callback is stable across renders (so memoized components skip), while
  // the *behavior* always reads the freshest slots/scope at call time.
  const latest = useRef<{
    slots: Record<string, ActionDefinition | ActionDefinition[]>;
    scope: BindingScope;
    dispatch: typeof dispatch;
  }>({ slots: {}, scope, dispatch });
  const stableCallbacks = useRef<Record<string, (event?: unknown) => void>>({});

  const degraded = (reason: 'unknown-type' | 'version-gated') => {
    if (node.fallback) {
      return <SDUINodeView node={node.fallback} path={`${path}.fallback`} item={item} />;
    }
    return (
      <UnsupportedNode
        nodeType={node.type}
        nodeId={node.id}
        reason={reason}
        message={
          typeof node.props?.fallbackMessage === 'string'
            ? node.props.fallbackMessage
            : undefined
        }
      />
    );
  };

  // 1. Visibility — evaluated before anything is built, so a hidden section
  //    costs nothing beyond the condition check.
  if (!evaluateCondition(node.visibleWhen, state)) return null;

  // 2. Version gate.
  if (!isNodeSupported(node.minVersion)) return degraded('version-gated');

  // 3. Registry lookup.
  const Component = lookupComponent(node.type);
  if (!Component) return degraded('unknown-type');

  // 4. Props and styles, with bindings resolved against current state.
  const resolvedProps = resolveValue(node.props ?? {}, scope) as Record<string, unknown>;
  const resolvedStyle = resolveStyleTokens(
    resolveValue(node.style, scope) as Record<string, unknown> | undefined,
    theme,
  );

  // 5. Action slots → callback props. `action` is sugar for `actions.onPress`.
  const slots: Record<string, ActionDefinition | ActionDefinition[]> = {
    ...(node.action ? { onPress: node.action } : {}),
    ...(node.actions ?? {}),
  };
  latest.current = { slots, scope, dispatch };

  const callbacks: Record<string, (event?: unknown) => void> = {};
  for (const slotName of Object.keys(slots)) {
    if (!stableCallbacks.current[slotName]) {
      stableCallbacks.current[slotName] = (event?: unknown) => {
        const current = latest.current;
        const definition = current.slots[slotName];
        if (definition) {
          current.dispatch(definition, { ...current.scope, event });
        }
      };
    }
    callbacks[slotName] = stableCallbacks.current[slotName];
  }

  // 6. Children: either an explicit list, or a template repeated over data.
  let children: React.ReactNode = null;

  const repeatData =
    node.forEach ??
    (node.forEachStateKey
      ? (state[node.forEachStateKey] as Record<string, unknown>[] | undefined)
      : undefined);

  if (node.template && Array.isArray(repeatData)) {
    children = repeatData.map((entry, index) => (
      <SDUINodeView
        key={(entry?.id as string) ?? `${path}.each.${index}`}
        node={node.template as SDUINode}
        path={`${path}.each.${index}`}
        item={entry}
      />
    ));
  } else if (Array.isArray(node.children) && node.children.length > 0) {
    children = node.children.map((child, index) => (
      <SDUINodeView
        key={child.id ?? `${path}.${child.type}.${index}`}
        node={child}
        path={`${path}.${child.type}.${index}`}
        item={item}
      />
    ));
  }

  return (
    <NodeErrorBoundary
      nodeType={node.type}
      nodeId={node.id}
      fallback={
        <UnsupportedNode nodeType={node.type} nodeId={node.id} reason="render-error" />
      }
    >
      <Component {...resolvedProps} {...callbacks} style={resolvedStyle}>
        {children}
      </Component>
    </NodeErrorBoundary>
  );
});

SDUINodeView.displayName = 'SDUINodeView';

export { SDUINodeView };

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

interface RendererProps {
  nodes?: SDUINode[];
  node?: SDUINode;
}

export const SDUIRenderer: React.FC<RendererProps> = React.memo(({ nodes, node }) => {
  if (Array.isArray(nodes)) {
    return (
      <>
        {nodes.map((child, index) => (
          <SDUINodeView
            key={child.id ?? `root.${child.type}.${index}`}
            node={child}
            path={`root.${index}`}
          />
        ))}
      </>
    );
  }
  if (node) return <SDUINodeView node={node} path="root.0" />;
  return null;
});

SDUIRenderer.displayName = 'SDUIRenderer';
