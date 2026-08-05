import { useEffect, useState } from 'react';
import type { SDUIPageSchema } from '../types/schema';
import { fetchPage, MOCK_NETWORK_LATENCY_MS } from '../server/mockServer';
import { checkPageVersion } from '../engine/versioning';
import { perfStore, now } from '../utils/perf';
import { useSDUI } from '../context/SDUIContext';
import { logger } from '../utils/logger';

interface PageLoad {
  schema: SDUIPageSchema | null;
  /** Set when the payload's major version is beyond this client. */
  unsupportedReason: string | null;
  error: string | null;
}

function countNodes(nodes: unknown[]): number {
  let count = 0;
  for (const node of nodes) {
    if (!node || typeof node !== 'object') continue;
    count += 1;
    const children = (node as { children?: unknown[] }).children;
    if (Array.isArray(children)) count += countNodes(children);
  }
  return count;
}

/**
 * Fetches a page from the mock server, measures the SDUI-only phases
 * (JSON.parse of the raw body, schema walk/prep), version-checks it, and
 * seeds runtime state from `initialState`.
 *
 * `extraState` lets a screen inject navigation params (e.g. the tapped car)
 * into binding scope — the one piece of glue a real server would precompute.
 */
export function useSDUIPage(
  pageId: string,
  perfName: string,
  extraState?: Record<string, unknown>,
): PageLoad {
  const { hydrateState } = useSDUI();
  const [load, setLoad] = useState<PageLoad>({
    schema: null,
    unsupportedReason: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetchPage(pageId, MOCK_NETWORK_LATENCY_MS);

        const parseStart = now();
        const schema = JSON.parse(response.body) as SDUIPageSchema;
        const parseMs = now() - parseStart;

        const prepareStart = now();
        const verdict = checkPageVersion(schema.version);
        const nodeCount = countNodes(schema.page ?? []);
        const prepareMs = now() - prepareStart;

        perfStore.mark(perfName, { parseMs, prepareMs, nodeCount });

        if (cancelled) return;

        if (!verdict.supported) {
          setLoad({ schema: null, unsupportedReason: verdict.reason ?? 'Unsupported schema', error: null });
          return;
        }

        hydrateState(schema.initialState, extraState);
        setLoad({ schema, unsupportedReason: null, error: null });
      } catch (caught) {
        // Full detail goes to telemetry; the user never sees a raw stack or
        // a SyntaxError from a malformed payload.
        logger.error('PAGE_LOAD', `Failed to load page "${pageId}": ${String(caught)}`);
        if (!cancelled) {
          setLoad({
            schema: null,
            unsupportedReason: null,
            error: 'This page could not be loaded. Please check your connection and try again.',
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // extraState is memoized on route params by callers — including it means
    // a same-screen navigation with new params re-hydrates instead of
    // showing the previous page's data.
  }, [pageId, perfName, extraState, hydrateState]);

  return load;
}
