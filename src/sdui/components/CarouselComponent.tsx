import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, hs, vs, msc, useResponsive, universalPaddingHorizontal } from './tokens';

interface CarouselComponentProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  /** Design-spec item width (px on the 375pt baseline); scaled and clamped. */
  itemWidth?: number;
}

export const CarouselComponent: React.FC<CarouselComponentProps> = React.memo(({
  title,
  subtitle,
  children,
  itemWidth = 260,
}) => {
  const { window, isTablet } = useResponsive();

  // Scale the server-sent width, then clamp so a card can never exceed the
  // viewport on small phones, and never balloons on tablets — instead more
  // of the next card peeks, which is the correct rail affordance.
  const scaled = hs(itemWidth);
  const maxWidth = isTablet ? 360 : window.width - hs(56);
  const resolvedWidth = Math.min(scaled, maxWidth);
  const gap = hs(12);

  return (
    <View style={styles.container}>
      {title ? (
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
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
        snapToInterval={resolvedWidth + gap}
      >
        {React.Children.map(children, child => (
          <View style={{ width: resolvedWidth, marginRight: gap }}>{child}</View>
        ))}
      </ScrollView>
    </View>
  );
});

CarouselComponent.displayName = 'CarouselComponent';

const styles = StyleSheet.create({
  container: {
    marginVertical: vs(10),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: universalPaddingHorizontal,
    marginBottom: vs(8),
  },
  headerText: {
    flexShrink: 1,
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
  scrollContent: {
    paddingHorizontal: universalPaddingHorizontal,
  },
});
