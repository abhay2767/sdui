import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

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

export const HeaderComponent: React.FC<HeaderComponentProps> = ({
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
        <View>
          <Text style={styles.brandTitle}>{title}</Text>
          <Text style={styles.brandSubtitle}>{subtitle}</Text>
        </View>

        <TouchableOpacity style={styles.locationBadge} onPress={onLocationPress} activeOpacity={0.7}>
          <Text style={styles.locationPin}>📍</Text>
          <Text style={styles.locationText}>{location}</Text>
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
          <Text style={styles.placeholderText}>{searchPlaceholder}</Text>
          <TouchableOpacity 
            style={styles.filterBtn} 
            onPress={(e) => {
              e.stopPropagation();
              if (onFilterPress) onFilterPress();
            }} 
            activeOpacity={0.7}
          >
            <Text style={styles.filterBtnText}>⚙️</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FF6B00',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  locationPin: {
    fontSize: 11,
    marginRight: 4,
  },
  locationText: {
    fontSize: 11,
    color: '#F8FAFC',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchIcon: {
    fontSize: 13,
    marginRight: 8,
  },
  placeholderText: {
    flex: 1,
    fontSize: 12,
    color: '#94A3B8',
  },
  filterBtn: {
    backgroundColor: '#334155',
    borderRadius: 6,
    padding: 5,
    paddingHorizontal: 7,
  },
  filterBtnText: {
    fontSize: 11,
  },
});
