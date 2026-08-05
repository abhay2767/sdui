import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { COLORS, RADIUS, hs, vs, msc, universalPaddingHorizontal } from './tokens';

export interface ChipItem {
  id: string;
  label: string;
  icon?: string;
}

interface ChipGroupComponentProps {
  items?: ChipItem[];
  /**
   * Bound from state in the payload: `"selected": "{{state.selectedCategory}}"`.
   * The component knows nothing about *which* state key drives it.
   */
  selected?: string;
  /** Action slot; the tapped chip arrives as `{{event.*}}` in the payload. */
  onSelect?: (item: ChipItem) => void;
  style?: StyleProp<ViewStyle>;
}

export const ChipGroupComponent: React.FC<ChipGroupComponentProps> = React.memo(
  ({ items = [], selected, onSelect, style }) => {
    return (
      <View style={[styles.container, style]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {items.map(item => {
            const isSelected = item.id === selected;
            return (
              <TouchableOpacity
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                accessibilityState={{ selected: isSelected }}
                activeOpacity={0.7}
                onPress={() => onSelect?.(item)}
                style={[styles.chip, isSelected ? styles.chipSelected : styles.chipUnselected]}
              >
                {item.icon ? <Text style={styles.icon}>{item.icon}</Text> : null}
                <Text
                  style={[
                    styles.label,
                    isSelected ? styles.labelSelected : styles.labelUnselected,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  },
);

ChipGroupComponent.displayName = 'ChipGroupComponent';

const styles = StyleSheet.create({
  container: {
    marginVertical: vs(8),
  },
  scrollContent: {
    paddingHorizontal: universalPaddingHorizontal,
    gap: hs(8),
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: hs(14),
    paddingVertical: vs(8),
    borderRadius: RADIUS.pill,
    borderWidth: 1,
  },
  chipUnselected: {
    backgroundColor: COLORS.canvas,
    borderColor: COLORS.line,
  },
  chipSelected: {
    backgroundColor: COLORS.ink,
    borderColor: COLORS.ink,
  },
  icon: {
    fontSize: msc(13),
    marginRight: hs(5),
  },
  label: {
    fontSize: msc(13),
    fontWeight: '600',
  },
  labelUnselected: {
    color: COLORS.inkSoft,
  },
  labelSelected: {
    color: COLORS.buttonText,
  },
});
