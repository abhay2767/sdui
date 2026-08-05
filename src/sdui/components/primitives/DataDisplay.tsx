import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { COLORS, RADIUS, color, hs, vs, msc } from '../tokens';

// ---------------------------------------------------------------------------
// KEY_VALUE_ROW — spec sheets, price breakdowns, inspection reports.
// ---------------------------------------------------------------------------

interface KeyValueProps {
  label?: string;
  value?: string | number;
  icon?: string;
  emphasis?: boolean;
  valueColor?: string;
  style?: StyleProp<ViewStyle>;
}

export const KeyValueRowNode: React.FC<KeyValueProps> = React.memo(
  ({ label = '', value = '', icon, emphasis, valueColor, style }) => (
    <View style={[styles.kvRow, style]}>
      <Text style={styles.kvLabel}>
        {icon ? `${icon} ` : ''}
        {label}
      </Text>
      <Text
        style={[
          styles.kvValue,
          emphasis && styles.kvValueEmphasis,
          { color: color(valueColor, emphasis ? COLORS.primary : COLORS.ink) },
        ]}
      >
        {value}
      </Text>
    </View>
  ),
);
KeyValueRowNode.displayName = 'KeyValueRowNode';

// ---------------------------------------------------------------------------
// STAT_TILE — the small boxed metrics used across detail screens.
// ---------------------------------------------------------------------------

interface StatProps {
  label?: string;
  value?: string | number;
  icon?: string;
  background?: string;
  style?: StyleProp<ViewStyle>;
}

export const StatTileNode: React.FC<StatProps> = React.memo(
  ({ label = '', value = '', icon, background, style }) => (
    <View style={[styles.stat, { backgroundColor: color(background, COLORS.canvas) }, style]}>
      {icon ? <Text style={styles.statIcon}>{icon}</Text> : null}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  ),
);
StatTileNode.displayName = 'StatTileNode';

// ---------------------------------------------------------------------------
// RATING — star bar.
// ---------------------------------------------------------------------------

interface RatingProps {
  value?: number;
  max?: number;
  label?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const RatingNode: React.FC<RatingProps> = React.memo(
  ({ value = 0, max = 5, label, size = 14, style }) => {
    const filled = Math.round(Number(value));
    return (
      <View style={[styles.ratingRow, style]}>
        <Text style={{ fontSize: msc(size) }}>
          {'★'.repeat(Math.max(0, Math.min(filled, max)))}
          <Text style={styles.ratingEmpty}>{'★'.repeat(Math.max(0, max - filled))}</Text>
        </Text>
        {label ? <Text style={styles.ratingLabel}>{label}</Text> : null}
      </View>
    );
  },
);
RatingNode.displayName = 'RatingNode';

// ---------------------------------------------------------------------------
// PROGRESS_BAR — inspection scores, loan eligibility, upload states.
// ---------------------------------------------------------------------------

interface ProgressProps {
  value?: number;
  max?: number;
  label?: string;
  tone?: string;
  style?: StyleProp<ViewStyle>;
}

export const ProgressBarNode: React.FC<ProgressProps> = React.memo(
  ({ value = 0, max = 100, label, tone, style }) => {
    const ratio = Math.max(0, Math.min(Number(value) / (Number(max) || 1), 1));
    return (
      <View style={style}>
        {label ? <Text style={styles.progressLabel}>{label}</Text> : null}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${ratio * 100}%`, backgroundColor: color(tone, COLORS.success) },
            ]}
          />
        </View>
      </View>
    );
  },
);
ProgressBarNode.displayName = 'ProgressBarNode';

const styles = StyleSheet.create({
  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(9),
  },
  kvLabel: {
    fontSize: msc(13),
    color: COLORS.muted,
    flexShrink: 1,
    paddingRight: hs(12),
  },
  kvValue: {
    fontSize: msc(13),
    fontWeight: '600',
  },
  kvValueEmphasis: {
    fontSize: msc(15),
    fontWeight: '800',
  },
  stat: {
    flex: 1,
    borderRadius: RADIUS.md,
    paddingVertical: vs(12),
    paddingHorizontal: hs(8),
    alignItems: 'center',
  },
  statIcon: {
    fontSize: msc(16),
    marginBottom: vs(2),
  },
  statValue: {
    fontSize: msc(14),
    fontWeight: '800',
    color: COLORS.ink,
  },
  statLabel: {
    fontSize: msc(10),
    color: COLORS.muted,
    marginTop: vs(2),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: hs(6),
  },
  ratingEmpty: {
    color: COLORS.line,
  },
  ratingLabel: {
    fontSize: msc(12),
    color: COLORS.muted,
    fontWeight: '600',
  },
  progressLabel: {
    fontSize: msc(12),
    color: COLORS.muted,
    marginBottom: vs(6),
    fontWeight: '600',
  },
  progressTrack: {
    height: vs(8),
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.line,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.pill,
  },
});
