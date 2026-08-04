import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GridComponentProps {
  title?: string;
  subtitle?: string;
  columns?: number;
  gap?: number;
  children?: React.ReactNode;
}

export const GridComponent: React.FC<GridComponentProps> = ({
  title,
  subtitle,
  columns = 2,
  gap = 12,
  children,
}) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <View style={styles.container}>
      {title ? (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      ) : null}

      <View style={[styles.grid, { gap }]}>
        {childrenArray.map((child, index) => (
          <View
            key={index}
            style={{
              width: `${(100 - (columns - 1) * 3) / columns}%`,
            }}
          >
            {child}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 10,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
