import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

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

export const CarCardComponent: React.FC<CarCardProps> = ({
  title,
  subtitle,
  price,
  emi,
  year = 2021,
  mileage = '32,000 km',
  fuelType = 'Petrol',
  transmission = 'Manual',
  location = 'Delhi',
  imageUrl,
  tag = '140-Point Checked',
  isWishlisted = false,
  onPress,
  onWishlistPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={onPress}
    >
      {/* Image Container with Badges */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.carEmoji}>🚘</Text>
          </View>
        )}

        {tag ? (
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>✓ {tag}</Text>
          </View>
        ) : null}

        <TouchableOpacity style={styles.wishlistBtn} onPress={onWishlistPress} activeOpacity={0.7}>
          <Text style={styles.heartIcon}>{isWishlisted ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {year} {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

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
          <View>
            <Text style={styles.price}>{price}</Text>
            {emi ? <Text style={styles.emi}>EMI from {emi}/mo</Text> : null}
          </View>
          <View style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View →</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  imageContainer: {
    height: 140,
    backgroundColor: '#F1F5F9',
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
    backgroundColor: '#E2E8F0',
  },
  carEmoji: {
    fontSize: 48,
  },
  tagBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    fontSize: 16,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  specItem: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  specDot: {
    fontSize: 10,
    color: '#CBD5E1',
    marginHorizontal: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FF6B00',
  },
  emi: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  viewBtn: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B00',
  },
});
