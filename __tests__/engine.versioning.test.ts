import {
  checkPageVersion,
  isNodeSupported,
  compareVersions,
} from '../src/sdui/engine/versioning';

describe('versioning', () => {
  it('compares major.minor correctly', () => {
    expect(compareVersions('1.0', '1.2')).toBe(-1);
    expect(compareVersions('1.2', '1.2')).toBe(0);
    expect(compareVersions('2.0', '1.9')).toBe(1);
  });

  it('accepts same and older payloads', () => {
    expect(checkPageVersion('1.0', '1.2').supported).toBe(true);
    expect(checkPageVersion('1.2', '1.2').supported).toBe(true);
  });

  it('accepts newer MINOR payloads (additive changes degrade per-node)', () => {
    expect(checkPageVersion('1.5', '1.2').supported).toBe(true);
  });

  it('rejects newer MAJOR payloads (fields may have new meaning)', () => {
    const verdict = checkPageVersion('2.0', '1.2');
    expect(verdict.supported).toBe(false);
    expect(verdict.reason).toContain('2.0');
  });

  it('tolerates a missing version field', () => {
    expect(checkPageVersion(undefined).supported).toBe(true);
  });

  it('gates individual nodes on minVersion', () => {
    expect(isNodeSupported(undefined, '1.2')).toBe(true);
    expect(isNodeSupported('1.0', '1.2')).toBe(true);
    expect(isNodeSupported('2.0', '1.2')).toBe(false);
  });
});
