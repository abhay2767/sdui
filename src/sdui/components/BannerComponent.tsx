import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

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

export const BannerComponent: React.FC<BannerComponentProps> = ({
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
          source={{ uri: imageUrl }}
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
};

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
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
    paddingRight: 12,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF6B00',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 10,
    lineHeight: 16,
  },
  ctaButton: {
    alignSelf: 'flex-start',
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
  },
  bannerImage: {
    width: 85,
    height: 85,
    borderRadius: 12,
  },
  illustrationBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationEmoji: {
    fontSize: 32,
  },
});
