import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

interface HeaderComponentProps {
  title?: string;
  subtitle?: string;
  location?: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
  onSearchPress?: () => void;
  onLocationPress?: () => void;
}

export const HeaderComponent: React.FC<HeaderComponentProps> = ({
  title = 'CARS24',
  subtitle = 'Quality Used Cars',
  location = 'New Delhi ▾',
  searchPlaceholder = 'Search by brand, model, e.g. Swift, Creta',
  showSearch = true,
  onSearchPress,
  onLocationPress,
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
          <View style={styles.filterBtn}>
            <Text style={styles.filterBtnText}>⚙️</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF6B00', // Cars24 Orange
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  locationPin: {
    fontSize: 12,
    marginRight: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#F8FAFC',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  placeholderText: {
    flex: 1,
    fontSize: 13,
    color: '#94A3B8',
  },
  filterBtn: {
    backgroundColor: '#334155',
    borderRadius: 6,
    padding: 4,
  },
  filterBtnText: {
    fontSize: 12,
  },
});
