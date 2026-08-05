import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SDUIRenderer, SDUIPageProvider } from '../sdui/renderer/Renderer';
import { useSDUIPage } from '../sdui/hooks/useSDUIPage';
import { SkeletonDetailPage } from '../sdui/components/skeletons/PageSkeletons';
import type { RootStackParamList, CarParams } from '../navigation/navigationRef';
import { COLORS, hs, vs, msc } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CarDetails'>;

const DEFAULT_CAR: CarParams = {
  id: 'car_1',
  title: 'Hyundai Creta SX 1.5',
  price: '₹11.45 Lakh',
  year: 2022,
  mileage: '24,500 km',
  fuel: 'Petrol',
  transmission: 'Manual',
  owner: '1st Owner',
  emi24: '26,300',
  emi36: '18,450',
  emi48: '14,600',
  emi60: '12,150',
  imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80',
};

/**
 * SDUI-driven detail page. The NAVIGATE action delivers the tapped car in
 * `route.params.car`; it is injected into binding scope as `state.car`, and
 * carDetailsSDUI.json renders everything from `{{state.car.*}}` bindings —
 * including the per-car EMI tenure selector.
 */
export const CarDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();

  // Memoized on route.params and USED as an effect dependency in
  // useSDUIPage, so a CarDetails→CarDetails navigation (same screen
  // instance, new params) re-hydrates instead of showing the previous car.
  const extraState = React.useMemo(() => {
    const car: CarParams = { ...DEFAULT_CAR, ...(route.params?.car ?? {}) };
    return {
      car,
      carTenure: '36',
      carEmi: car.emi36,
    };
  }, [route.params]);

  const { schema, unsupportedReason, error } = useSDUIPage(
    'carDetails',
    'SDUI_CAR_DETAILS',
    extraState,
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.topBar}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Car Details</Text>
        <View style={styles.topSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, vs(24)) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {schema?.page ? (
          <SDUIPageProvider theme={schema.theme}>
            <SDUIRenderer nodes={schema.page} />
          </SDUIPageProvider>
        ) : unsupportedReason || error ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{unsupportedReason ?? error}</Text>
          </View>
        ) : (
          <SkeletonDetailPage />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.chromeBg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: hs(16),
    paddingVertical: vs(10),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.chromeLine,
    backgroundColor: COLORS.chromeBg,
  },
  backBtn: {
    padding: hs(4),
  },
  backText: {
    color: COLORS.primary,
    fontSize: msc(15),
    fontWeight: '700',
  },
  topTitle: {
    color: COLORS.onDark,
    fontSize: msc(16),
    fontWeight: '700',
  },
  topSpacer: {
    width: hs(60),
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  content: {
    paddingBottom: vs(24),
  },
  messageBox: {
    padding: hs(32),
    alignItems: 'center',
  },
  messageText: {
    color: COLORS.muted,
    fontSize: msc(13),
    textAlign: 'center',
  },
});
