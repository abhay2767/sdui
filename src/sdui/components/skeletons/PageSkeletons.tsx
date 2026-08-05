import React from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import { Skeleton } from './Skeleton';
import { COLORS, RADIUS, hs, vs, cardImageHeight, heroImageHeight, universalPaddingHorizontal } from '../tokens';

/** Skeleton for one car card (image block + text lines + price row). */
export const SkeletonCarCard: React.FC<{ width?: DimensionValue }> = React.memo(
  ({ width = '100%' }) => (
    <View style={[styles.card, { width }]}>
      <Skeleton height={cardImageHeight} radius={0} />
      <View style={styles.cardBody}>
        <Skeleton width="80%" height={vs(14)} />
        <Skeleton width="55%" height={vs(10)} style={styles.gapTop} />
        <View style={styles.priceRow}>
          <Skeleton width={hs(80)} height={vs(16)} />
          <Skeleton width={hs(56)} height={vs(24)} radius={RADIUS.sm} />
        </View>
      </View>
    </View>
  ),
);
SkeletonCarCard.displayName = 'SkeletonCarCard';

/**
 * Home-page skeleton: mirrors the real section order (header, chips, banner,
 * rail, grid) so content pops in without layout shift.
 */
export const SkeletonHomePage: React.FC = React.memo(() => (
  <View>
    {/* Header block */}
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <View>
          <Skeleton width={hs(110)} height={vs(20)} />
          <Skeleton width={hs(140)} height={vs(9)} style={styles.gapTop} />
        </View>
        <Skeleton width={hs(110)} height={vs(26)} radius={RADIUS.pill} />
      </View>
      <Skeleton height={vs(36)} radius={RADIUS.md} style={styles.gapTopLg} />
    </View>

    {/* Chips */}
    <View style={styles.chipsRow}>
      {[0, 1, 2, 3].map(index => (
        <Skeleton key={index} width={hs(84)} height={vs(32)} radius={RADIUS.pill} />
      ))}
    </View>

    {/* Banner */}
    <View style={styles.section}>
      <Skeleton height={vs(110)} radius={RADIUS.lg} />
    </View>

    {/* Carousel rail */}
    <View style={styles.section}>
      <Skeleton width={hs(180)} height={vs(16)} style={styles.gapBottom} />
      <View style={styles.rail}>
        <SkeletonCarCard width={hs(250)} />
        <SkeletonCarCard width={hs(250)} />
      </View>
    </View>

    {/* Grid */}
    <View style={styles.section}>
      <Skeleton width={hs(160)} height={vs(16)} style={styles.gapBottom} />
      <View style={styles.gridRow}>
        <SkeletonCarCard width="48%" />
        <SkeletonCarCard width="48%" />
      </View>
    </View>
  </View>
));
SkeletonHomePage.displayName = 'SkeletonHomePage';

/** Detail-page skeleton: hero image + title/price + stat tiles + rows. */
export const SkeletonDetailPage: React.FC = React.memo(() => (
  <View>
    <Skeleton height={heroImageHeight} radius={0} />
    <View style={styles.detailBody}>
      <Skeleton width={hs(120)} height={vs(18)} radius={RADIUS.pill} />
      <Skeleton width="75%" height={vs(20)} style={styles.gapTopLg} />
      <Skeleton width={hs(140)} height={vs(24)} style={styles.gapTop} />
      <View style={styles.statRow}>
        <Skeleton width="31%" height={vs(64)} radius={RADIUS.md} />
        <Skeleton width="31%" height={vs(64)} radius={RADIUS.md} />
        <Skeleton width="31%" height={vs(64)} radius={RADIUS.md} />
      </View>
      {[0, 1, 2, 3].map(index => (
        <Skeleton key={index} height={vs(14)} style={styles.gapTopLg} />
      ))}
    </View>
  </View>
));
SkeletonDetailPage.displayName = 'SkeletonDetailPage';

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.chromeBg,
    paddingHorizontal: universalPaddingHorizontal,
    paddingTop: vs(10),
    paddingBottom: vs(14),
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: hs(8),
    paddingHorizontal: universalPaddingHorizontal,
    marginVertical: vs(10),
  },
  section: {
    paddingHorizontal: universalPaddingHorizontal,
    marginVertical: vs(8),
  },
  rail: {
    flexDirection: 'row',
    gap: hs(12),
    overflow: 'hidden',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.line,
    overflow: 'hidden',
  },
  cardBody: {
    padding: hs(12),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: vs(12),
  },
  detailBody: {
    padding: hs(20),
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(16),
  },
  gapTop: {
    marginTop: vs(6),
  },
  gapTopLg: {
    marginTop: vs(12),
  },
  gapBottom: {
    marginBottom: vs(10),
  },
});
