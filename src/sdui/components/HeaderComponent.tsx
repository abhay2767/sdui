import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, hs, vs, msc, universalPaddingHorizontal } from './tokens';

interface HeaderComponentProps {
  title?: string;
  subtitle?: string;
  location?: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
  onSearchPress?: () => void;
  onLocationPress?: () => void;
  onFilterPress?: () => void;
}

export const HeaderComponent: React.FC<HeaderComponentProps> = React.memo(({
  title = 'CARS24',
  subtitle = 'Quality Used Cars',
  location = 'New Delhi ▾',
  searchPlaceholder = 'Search by brand, model, e.g. Swift, Creta',
  showSearch = true,
  onSearchPress,
  onLocationPress,
  onFilterPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.topRow}>
        <View style={styles.brandBlock}>
          <Text style={styles.brandTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.brandSubtitle} numberOfLines={1}>{subtitle}</Text>
        </View>

        <TouchableOpacity style={styles.locationBadge} onPress={onLocationPress} activeOpacity={0.7}>
          <Text style={styles.locationPin}>📍</Text>
          <Text style={styles.locationText} numberOfLines={1}>{location}</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input Bar */}
      {showSearch && (
        <TouchableOpacity
          style={styles.searchContainer}
          activeOpacity={0.9}
          onPress={onSearchPress}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.placeholderText} numberOfLines={1}>{searchPlaceholder}</Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Open filters"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.filterBtn}
            onPress={onFilterPress}
            activeOpacity={0.7}
          >
            <Text style={styles.filterBtnText}>⚙️</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </View>
  );
});

HeaderComponent.displayName = 'HeaderComponent';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.chromeBg,
    paddingTop: vs(10),
    paddingBottom: vs(12),
    paddingHorizontal: universalPaddingHorizontal,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  brandBlock: {
    flexShrink: 1,
    paddingRight: hs(8),
  },
  brandTitle: {
    fontSize: msc(22),
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: msc(10),
    color: COLORS.faint,
    fontWeight: '500',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.chromeSurface,
    paddingHorizontal: hs(10),
    paddingVertical: vs(5),
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.inkSoft,
    maxWidth: '55%',
  },
  locationPin: {
    fontSize: msc(11),
    marginRight: hs(4),
  },
  locationText: {
    fontSize: msc(11),
    color: COLORS.onDark,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.chromeSurface,
    borderRadius: RADIUS.md,
    paddingHorizontal: hs(12),
    paddingVertical: vs(8),
    borderWidth: 1,
    borderColor: COLORS.inkSoft,
  },
  searchIcon: {
    fontSize: msc(13),
    marginRight: hs(8),
  },
  placeholderText: {
    flex: 1,
    fontSize: msc(12),
    color: COLORS.faint,
  },
  filterBtn: {
    backgroundColor: COLORS.inkSoft,
    borderRadius: RADIUS.sm,
    padding: hs(5),
    paddingHorizontal: hs(7),
  },
  filterBtnText: {
    fontSize: msc(11),
  },
});
