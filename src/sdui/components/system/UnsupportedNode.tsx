import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { logger } from '../../utils/logger';
import { RADIUS, hs, vs, msc, FONTS, universalPaddingHorizontal } from '../tokens';

export type UnsupportedReason = 'unknown-type' | 'version-gated' | 'render-error';

interface Props {
  nodeType: string;
  nodeId?: string;
  reason?: UnsupportedReason;
  /** Server-supplied human copy, so the message can improve without a release. */
  message?: string;
  /**
   * When false, the node collapses to nothing instead of showing a placeholder.
   * Production payloads set this for cosmetic sections; the debug placeholder
   * is what you want in dev and in this demo.
   */
  visible?: boolean;
}

const COPY: Record<UnsupportedReason, string> = {
  'unknown-type': 'This section needs a newer version of the app.',
  'version-gated': 'This section requires a newer app version.',
  'render-error': 'This section could not be displayed.',
};

/**
 * Rendered in place of any node the client cannot render. Never throws, and
 * always reports — a silently-dropped section is a production incident nobody
 * finds out about until a metric moves.
 */
export const UnsupportedNode: React.FC<Props> = ({
  nodeType,
  nodeId,
  reason = 'unknown-type',
  message,
  visible = true,
}) => {
  React.useEffect(() => {
    logger.warn(
      'UNSUPPORTED_NODE',
      `Degraded "${nodeType}"${nodeId ? ` (${nodeId})` : ''} — ${reason}`,
      { nodeType, nodeId, reason },
    );
  }, [nodeType, nodeId, reason]);

  if (!visible) return null;

  return (
    <View style={styles.container} testID={`unsupported-${nodeType}`}>
      <Text style={styles.icon}>⚠️</Text>
      <View style={styles.body}>
        <Text style={styles.title}>Section unavailable</Text>
        <Text style={styles.subtitle}>{message || COPY[reason]}</Text>
        {__DEV__ ? <Text style={styles.debug}>{reason} · {nodeType}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: vs(8),
    marginHorizontal: universalPaddingHorizontal,
    padding: hs(14),
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: msc(20),
    marginRight: hs(12),
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: msc(14),
    fontWeight: '700',
    color: '#9A3412',
    marginBottom: vs(2),
  },
  subtitle: {
    fontSize: msc(12),
    color: '#C2410C',
  },
  debug: {
    marginTop: vs(4),
    fontSize: msc(10),
    color: '#EA580C',
    fontFamily: FONTS.mono,
  },
});
