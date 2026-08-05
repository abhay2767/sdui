/**
 * Mock SDUI backend.
 *
 * Serves page payloads as raw JSON *strings*, the way a network response body
 * would arrive. This matters for measurement honesty: a Metro `import` of a
 * .json file is parsed at build time, so "parse time" measured on it would be
 * fiction. Here the client receives a string and pays the real JSON.parse
 * cost, which is what PERF.md reports.
 *
 * The payloads still live in editable .json files (src/data/*.json) so the
 * live-edit demo works: change the file, reload, the page changes.
 */

const PAGES: Record<string, unknown> = {
  home: require('../../data/homeSDUI.json'),
  carDetails: require('../../data/carDetailsSDUI.json'),
};

export interface ServerResponse {
  /** Raw JSON body, exactly as a network layer would hand it over. */
  body: string;
}

/**
 * Simulated network latency so skeleton states are visible in the demo.
 * ⚠ Set to 0 when recording PERF.md numbers — TTR/TTI are measured from
 * screen mount and would otherwise include this artificial delay (PERF.md's
 * protocol calls this out).
 */
export const MOCK_NETWORK_LATENCY_MS = 400;

/** Simulated fetch. `latencyMs` mimics network delay when you want it. */
export async function fetchPage(pageId: string, latencyMs = 0): Promise<ServerResponse> {
  const page = PAGES[pageId];
  if (!page) throw new Error(`Mock server has no page "${pageId}"`);
  // Serialization happens server-side in real life; do it before the client
  // timer starts so it never pollutes client-side measurements.
  const body = JSON.stringify(page);
  if (latencyMs > 0) {
    await new Promise<void>(resolve => setTimeout(resolve, latencyMs));
  }
  return { body };
}
