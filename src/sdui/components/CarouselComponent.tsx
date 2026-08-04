import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface CarouselComponentProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  itemWidth?: number;
}

export const CarouselComponent: React.FC<CarouselComponentProps> = ({
  title,
  subtitle,
  children,
  itemWidth = 260,
}) => {
  return (
    <View style={styles.container}>
      {title ? (
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        </View>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={itemWidth + 12}
      >
        {React.Children.map(children, child => (
          <View style={[styles.itemWrapper, { width: itemWidth }]}>{child}</View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  itemWrapper: {
    marginRight: 12,
  },
});
