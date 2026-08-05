import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, hs, vs, msc, universalPaddingHorizontal } from './tokens';

interface BannerComponentProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  badge?: string;
  onPress?: () => void;
}

export const BannerComponent: React.FC<BannerComponentProps> = React.memo(({
  title = '7-Day Return Guarantee',
  subtitle = '100% Refund if you change your mind',
  ctaText = 'Explore Warranty',
  imageUrl,
  backgroundColor = '#1E1B4B',
  textColor = '#FFFFFF',
  badge = 'CARS24 PROMISE',
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.banner, { backgroundColor }]}
    >
      <View style={styles.contentContainer}>
        {badge ? (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}

        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        {ctaText ? (
          <View style={styles.ctaButton}>
            <Text style={styles.ctaText}>{ctaText} →</Text>
          </View>
        ) : null}
      </View>

      {imageUrl ? (
        <Image
          source={{ uri: imageUrl, cache: 'force-cache' }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.illustrationBox}>
          <Text style={styles.illustrationEmoji}>🚗⚡</Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

BannerComponent.displayName = 'BannerComponent';

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: universalPaddingHorizontal,
    marginVertical: vs(8),
    borderRadius: RADIUS.lg,
    padding: hs(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    paddingRight: hs(12),
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: hs(8),
    paddingVertical: vs(3),
    borderRadius: RADIUS.sm,
    marginBottom: vs(6),
  },
  badgeText: {
    fontSize: msc(9),
    fontWeight: '800',
    color: COLORS.buttonText,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: msc(16),
    fontWeight: '800',
    marginBottom: vs(4),
  },
  subtitle: {
    fontSize: msc(12),
    color: COLORS.faint,
    marginBottom: vs(10),
    lineHeight: msc(16),
  },
  ctaButton: {
    alignSelf: 'flex-start',
  },
  ctaText: {
    fontSize: msc(12),
    fontWeight: '700',
    color: COLORS.info,
  },
  bannerImage: {
    width: hs(85),
    height: hs(85),
    borderRadius: RADIUS.md,
  },
  illustrationBox: {
    width: hs(70),
    height: hs(70),
    borderRadius: hs(35),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationEmoji: {
    fontSize: msc(32),
  },
});
