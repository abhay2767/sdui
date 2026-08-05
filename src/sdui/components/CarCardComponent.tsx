import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, hs, vs, msc, cardImageHeight } from './tokens';

export interface CarCardProps {
  id?: string;
  title: string;
  subtitle?: string;
  price: string;
  emi?: string;
  year?: number;
  mileage?: string;
  fuelType?: string;
  transmission?: string;
  location?: string;
  imageUrl?: string;
  tag?: string;
  isWishlisted?: boolean;
  onPress?: () => void;
  onWishlistPress?: () => void;
}

export const CarCardComponent: React.FC<CarCardProps> = React.memo(({
  title,
  subtitle,
  price,
  emi,
  year = 2021,
  mileage = '32,000 km',
  fuelType = 'Petrol',
  transmission = 'Manual',
  imageUrl,
  tag = '140-Point Checked',
  isWishlisted = false,
  onPress,
  onWishlistPress,
}) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`${year} ${title}, ${price}${emi ? `, EMI from ${emi} per month` : ''}`}
      activeOpacity={0.85}
      style={styles.card}
      onPress={onPress}
    >
      {/* Image Container with Badges */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl, cache: 'force-cache' }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.carEmoji}>🚘</Text>
          </View>
        )}

        {tag ? (
          <View style={styles.tagBadge}>
            <Text style={styles.tagText} numberOfLines={1}>✓ {tag}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.wishlistBtn}
          onPress={onWishlistPress}
          activeOpacity={0.7}
        >
          <Text style={styles.heartIcon}>{isWishlisted ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {year} {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}

        {/* Specs Badges */}
        <View style={styles.specsRow}>
          <Text style={styles.specItem}>{mileage}</Text>
          <Text style={styles.specDot}>•</Text>
          <Text style={styles.specItem}>{fuelType}</Text>
          <Text style={styles.specDot}>•</Text>
          <Text style={styles.specItem}>{transmission}</Text>
        </View>

        {/* Price & EMI Section */}
        <View style={styles.priceRow}>
          <View style={styles.priceBlock}>
            <Text style={styles.price} numberOfLines={1}>{price}</Text>
            {emi ? <Text style={styles.emi} numberOfLines={1}>EMI from {emi}/mo</Text> : null}
          </View>
          <View style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View →</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

CarCardComponent.displayName = 'CarCardComponent';

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginVertical: vs(6),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.line,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  imageContainer: {
    height: cardImageHeight,
    backgroundColor: COLORS.skeletonHighlight,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.skeletonBase,
  },
  carEmoji: {
    fontSize: msc(48),
  },
  tagBadge: {
    position: 'absolute',
    top: vs(10),
    left: hs(10),
    maxWidth: '70%',
    backgroundColor: COLORS.success,
    paddingHorizontal: hs(8),
    paddingVertical: vs(3),
    borderRadius: RADIUS.sm,
  },
  tagText: {
    color: COLORS.buttonText,
    fontSize: msc(10),
    fontWeight: '700',
  },
  wishlistBtn: {
    position: 'absolute',
    top: vs(10),
    right: hs(10),
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    width: hs(32),
    height: hs(32),
    borderRadius: hs(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    fontSize: msc(16),
  },
  content: {
    padding: hs(12),
  },
  title: {
    fontSize: msc(15),
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: vs(2),
  },
  subtitle: {
    fontSize: msc(12),
    color: COLORS.muted,
    marginBottom: vs(6),
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: vs(10),
  },
  specItem: {
    fontSize: msc(11),
    color: COLORS.muted,
    fontWeight: '500',
  },
  specDot: {
    fontSize: msc(10),
    color: COLORS.line,
    marginHorizontal: hs(4),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: COLORS.skeletonHighlight,
    paddingTop: vs(8),
  },
  priceBlock: {
    flexShrink: 1,
    paddingRight: hs(6),
  },
  price: {
    fontSize: msc(16),
    fontWeight: '800',
    color: COLORS.primary,
  },
  emi: {
    fontSize: msc(11),
    color: COLORS.inkSoft,
    fontWeight: '600',
  },
  viewBtn: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: hs(12),
    paddingVertical: vs(6),
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  viewBtnText: {
    fontSize: msc(12),
    fontWeight: '700',
    color: COLORS.primary,
  },
});
