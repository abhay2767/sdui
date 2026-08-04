import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CarDetailsScreenProps {
  route: any;
  navigation: any;
}

export const CarDetailsScreen: React.FC<CarDetailsScreenProps> = ({ route, navigation }) => {
  const { title = 'Hyundai Creta SX', price = '₹11.45 Lakh', year = 2022, mileage = '24,500 km' } = route.params || {};

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Car Details</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80' }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✓ CARS24 CERTIFIED</Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.title}>{year} {title}</Text>
          <Text style={styles.price}>{price}</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Mileage</Text>
              <Text style={styles.statValue}>{mileage}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Fuel</Text>
              <Text style={styles.statValue}>Petrol</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Owner</Text>
              <Text style={styles.statValue}>1st Owner</Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>⚡ Action Triggered via SDUI</Text>
            <Text style={styles.infoText}>
              This screen was opened dynamically via the NAVIGATE action payload defined in JSON.
            </Text>
          </View>

          <TouchableOpacity style={styles.bookBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.bookBtnText}>Book Free Test Drive</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backBtn: {
    padding: 4,
  },
  backText: {
    color: '#FF6B00',
    fontSize: 16,
    fontWeight: '700',
  },
  topTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    paddingBottom: 32,
  },
  imageContainer: {
    height: 220,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  detailsCard: {
    padding: 20,
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -16,
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  price: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF6B00',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  infoBox: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: '#38BDF8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#38BDF8',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#E2E8F0',
    lineHeight: 18,
  },
  bookBtn: {
    backgroundColor: '#FF6B00',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
