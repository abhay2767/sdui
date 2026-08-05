import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { COLORS, RADIUS, hs, vs, msc } from '../tokens';

// ---------------------------------------------------------------------------
// SEGMENTED_CONTROL — the EMI tenure selector pattern. Fully server-driven:
// the payload provides segments and a SET_STATE action in the onSelect slot;
// selection highlight comes back in via the `selected` prop binding.
// ---------------------------------------------------------------------------

export interface Segment {
  id: string;
  label: string;
  sublabel?: string;
}

interface SegmentedProps {
  segments?: Segment[];
  /** Usually bound: `"selected": "{{state.selectedTenure}}"`. */
  selected?: string;
  /** Action slot; receives the tapped segment as `{{event.*}}`. */
  onSelect?: (segment: Segment) => void;
  style?: StyleProp<ViewStyle>;
}

export const SegmentedControlNode: React.FC<SegmentedProps> = React.memo(
  ({ segments = [], selected, onSelect, style }) => (
    <View style={[styles.segmentTrack, style]}>
      {segments.map(segment => {
        const active = segment.id === selected;
        return (
          <TouchableOpacity
            key={segment.id}
            accessibilityRole="button"
            accessibilityLabel={segment.sublabel ? `${segment.label}, ${segment.sublabel}` : segment.label}
            accessibilityState={{ selected: active }}
            activeOpacity={0.8}
            onPress={() => onSelect?.(segment)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>
              {segment.label}
            </Text>
            {segment.sublabel ? (
              <Text style={[styles.segmentSublabel, active && styles.segmentSublabelActive]}>
                {segment.sublabel}
              </Text>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  ),
);
SegmentedControlNode.displayName = 'SegmentedControlNode';

// ---------------------------------------------------------------------------
// LIST_ITEM — settings-style row with chevron; covers menus, FAQs, city lists.
// ---------------------------------------------------------------------------

interface ListItemProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  trailing?: string;
  showChevron?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ListItemNode: React.FC<ListItemProps> = React.memo(
  ({ title = '', subtitle, icon, trailing, showChevron = true, onPress, style }) => (
    <TouchableOpacity
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      disabled={!onPress}
      style={[styles.listItem, style]}
    >
      {icon ? <Text style={styles.listIcon}>{icon}</Text> : null}
      <View style={styles.listBody}>
        <Text style={styles.listTitle}>{title}</Text>
        {subtitle ? <Text style={styles.listSubtitle}>{subtitle}</Text> : null}
      </View>
      {trailing ? <Text style={styles.listTrailing}>{trailing}</Text> : null}
      {showChevron && onPress ? <Text style={styles.chevron}>›</Text> : null}
    </TouchableOpacity>
  ),
);
ListItemNode.displayName = 'ListItemNode';

// ---------------------------------------------------------------------------
// CHECK_ROW — inspection checklists, feature lists.
// ---------------------------------------------------------------------------

interface CheckRowProps {
  label?: string;
  checked?: boolean;
  detail?: string;
  style?: StyleProp<ViewStyle>;
}

export const CheckRowNode: React.FC<CheckRowProps> = React.memo(
  ({ label = '', checked = true, detail, style }) => (
    <View style={[styles.checkRow, style]}>
      <Text style={[styles.checkGlyph, !checked && styles.checkGlyphFail]}>
        {checked ? '✓' : '✕'}
      </Text>
      <Text style={styles.checkLabel}>{label}</Text>
      {detail ? <Text style={styles.checkDetail}>{detail}</Text> : null}
    </View>
  ),
);
CheckRowNode.displayName = 'CheckRowNode';

const styles = StyleSheet.create({
  segmentTrack: {
    flexDirection: 'row',
    backgroundColor: COLORS.canvas,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: hs(4),
    gap: hs(4),
  },
  segment: {
    flex: 1,
    borderRadius: RADIUS.sm,
    paddingVertical: vs(8),
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: COLORS.ink,
  },
  segmentLabel: {
    fontSize: msc(13),
    fontWeight: '700',
    color: COLORS.muted,
  },
  segmentLabelActive: {
    color: COLORS.buttonText,
  },
  segmentSublabel: {
    fontSize: msc(10),
    color: COLORS.faint,
    marginTop: vs(1),
  },
  segmentSublabelActive: {
    color: COLORS.faint,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(13),
    paddingHorizontal: hs(4),
  },
  listIcon: {
    fontSize: msc(18),
    marginRight: hs(12),
  },
  listBody: {
    flex: 1,
  },
  listTitle: {
    fontSize: msc(14),
    fontWeight: '600',
    color: COLORS.ink,
  },
  listSubtitle: {
    fontSize: msc(12),
    color: COLORS.muted,
    marginTop: vs(1),
  },
  listTrailing: {
    fontSize: msc(13),
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: hs(4),
  },
  chevron: {
    fontSize: msc(20),
    color: COLORS.faint,
    marginLeft: hs(4),
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(6),
  },
  checkGlyph: {
    width: hs(22),
    fontSize: msc(14),
    fontWeight: '800',
    color: COLORS.success,
  },
  checkGlyphFail: {
    color: COLORS.danger,
  },
  checkLabel: {
    flex: 1,
    fontSize: msc(13),
    color: COLORS.inkSoft,
  },
  checkDetail: {
    fontSize: msc(12),
    color: COLORS.muted,
  },
});
