import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, hs, vs, msc, useResponsive, universalPaddingHorizontal } from './tokens';

interface GridComponentProps {
  title?: string;
  subtitle?: string;
  /** Phone column count from the payload; tablets add one automatically. */
  columns?: number;
  gap?: number;
  children?: React.ReactNode;
}

export const GridComponent: React.FC<GridComponentProps> = React.memo(({
  title,
  subtitle,
  columns = 2,
  gap = 12,
  children,
}) => {
  const { isTablet, window } = useResponsive();
  const childrenArray = React.Children.toArray(children);

  // The payload's `columns` expresses phone-design intent; wide screens get
  // one extra column so cards keep a sane physical width instead of
  // stretching. Server can still force a count per breakpoint later.
  const resolvedColumns = isTablet ? columns + 1 : columns;
  const scaledGap = hs(gap);

  // Single source of truth for gutters: item width is computed from the
  // MEASURED row width minus the px gaps. (Percentage widths + px gap
  // double-counted the gutter and collapsed columns on narrow phones.)
  const [measuredWidth, setMeasuredWidth] = React.useState(0);
  const rowWidth = measuredWidth || window.width - 2 * hs(16);
  const itemWidth = Math.floor(
    (rowWidth - scaledGap * (resolvedColumns - 1)) / resolvedColumns,
  );

  return (
    <View style={styles.container}>
      {title ? (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      ) : null}

      <View
        style={[styles.grid, { gap: scaledGap }]}
        onLayout={event => setMeasuredWidth(event.nativeEvent.layout.width)}
      >
        {childrenArray.map((child, index) => (
          <View key={index} style={{ width: itemWidth }}>
            {child}
          </View>
        ))}
      </View>
    </View>
  );
});

GridComponent.displayName = 'GridComponent';

const styles = StyleSheet.create({
  container: {
    marginVertical: vs(10),
    paddingHorizontal: universalPaddingHorizontal,
  },
  header: {
    marginBottom: vs(10),
  },
  title: {
    fontSize: msc(18),
    fontWeight: '800',
    color: COLORS.ink,
  },
  subtitle: {
    fontSize: msc(12),
    color: COLORS.muted,
    marginTop: vs(2),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
