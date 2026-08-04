import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export interface ChipItem {
  id: string;
  label: string;
  icon?: string;
}

interface ChipGroupComponentProps {
  items: ChipItem[];
  selectedId?: string;
  stateKey?: string;
  onSelect?: (item: ChipItem) => void;
}

export const ChipGroupComponent: React.FC<ChipGroupComponentProps> = ({
  items = [],
  selectedId,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map(item => {
          const isSelected = item.id === selectedId;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => onSelect && onSelect(item)}
              style={[
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected,
              ]}
            >
              {item.icon ? (
                <Text style={styles.icon}>{item.icon}</Text>
              ) : null}
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
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipUnselected: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  chipSelected: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  labelUnselected: {
    color: '#475569',
  },
  labelSelected: {
    color: '#FFFFFF',
  },
});
