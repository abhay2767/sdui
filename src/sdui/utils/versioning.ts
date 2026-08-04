import { logger } from './logger';

export const CURRENT_CLIENT_SCHEMA_VERSION = '1.0';

export function isSchemaSupported(schemaVersion: string): boolean {
  if (!schemaVersion) return true;
  
  const [clientMajor] = CURRENT_CLIENT_SCHEMA_VERSION.split('.').map(Number);
  const [schemaMajor] = schemaVersion.split('.').map(Number);

  if (schemaMajor > clientMajor) {
    logger.warn('VERSION_CHECK', `Schema version ${schemaVersion} is newer than client version ${CURRENT_CLIENT_SCHEMA_VERSION}. Fallbacks will be applied.`);
    return false;
  }
  return true;
}
