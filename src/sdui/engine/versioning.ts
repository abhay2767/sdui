import { logger } from '../utils/logger';

/**
 * The schema contract this binary implements. Bump the minor when adding a
 * backward-compatible capability (a new node field, a new action type); bump
 * the major only for a breaking reinterpretation of existing fields.
 */
export const CLIENT_SCHEMA_VERSION = '1.2';

export interface VersionVerdict {
  supported: boolean;
  reason?: string;
}

function parse(version: string): [number, number] {
  const [major, minor] = String(version).split('.');
  return [Number(major) || 0, Number(minor) || 0];
}

/** -1 / 0 / 1 comparison of two `"major.minor"` strings. */
export function compareVersions(a: string, b: string): number {
  const [aMajor, aMinor] = parse(a);
  const [bMajor, bMinor] = parse(b);
  if (aMajor !== bMajor) return aMajor < bMajor ? -1 : 1;
  if (aMinor !== bMinor) return aMinor < bMinor ? -1 : 1;
  return 0;
}

/**
 * Page-level gate.
 *
 * A newer *minor* is always accepted: minor bumps are additive, so an old
 * client renders what it knows and each unknown node degrades individually.
 * A newer *major* means existing fields may mean something different, so the
 * client stops trusting the payload and the caller shows a hard fallback.
 */
export function checkPageVersion(
  payloadVersion: string | undefined,
  clientVersion: string = CLIENT_SCHEMA_VERSION,
): VersionVerdict {
  if (!payloadVersion) return { supported: true };

  const [payloadMajor] = parse(payloadVersion);
  const [clientMajor] = parse(clientVersion);

  if (payloadMajor > clientMajor) {
    const reason = `Payload schema v${payloadVersion} is a major version ahead of client v${clientVersion}.`;
    logger.warn('VERSION', reason);
    return { supported: false, reason };
  }

  if (compareVersions(payloadVersion, clientVersion) > 0) {
    logger.info(
      'VERSION',
      `Payload v${payloadVersion} is newer than client v${clientVersion}; unknown nodes will degrade individually.`,
    );
  }

  return { supported: true };
}

/** Node-level gate for `minVersion`. */
export function isNodeSupported(
  minVersion: string | undefined,
  clientVersion: string = CLIENT_SCHEMA_VERSION,
): boolean {
  if (!minVersion) return true;
  return compareVersions(minVersion, clientVersion) <= 0;
}
