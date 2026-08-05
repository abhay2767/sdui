import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HeaderComponent } from '../sdui/components/HeaderComponent';
import { ChipGroupComponent } from '../sdui/components/ChipGroupComponent';
import { BannerComponent } from '../sdui/components/BannerComponent';
import { CarouselComponent } from '../sdui/components/CarouselComponent';
import { CarCardComponent } from '../sdui/components/CarCardComponent';
import { GridComponent } from '../sdui/components/GridComponent';
import { CardNode, RowNode, DividerNode, SpacerNode } from '../sdui/components/primitives/Layout';
import { TextNode } from '../sdui/components/primitives/Text';
import { StatTileNode, KeyValueRowNode } from '../sdui/components/primitives/DataDisplay';
import { SegmentedControlNode } from '../sdui/components/primitives/Interactive';
import {
  STATIC_HEADER_DATA,
  STATIC_CHIPS_DATA,
  STATIC_BANNER_DATA,
  STATIC_TENURES,
  STATIC_FEATURED_CARS,
  STATIC_POPULAR_CARS,
  STATIC_VALUE_PROPS,
  StaticCar,
} from '../data/staticHomeData';
import { useScreenTimings } from '../sdui/utils/useScreenTimings';
import { PerfBar } from '../components/PerfBar';
import type { RootStackParamList } from '../navigation/navigationRef';
import { COLORS, hs, vs } from '../theme';

const PERF_NAME = 'STATIC_HOME';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeStatic'>;

/**
 * The hardcoded baseline for PERF.md.
 *
 * Uses the SAME leaf components and the SAME measurement harness as the SDUI
 * screen — no JSON, no registry, no renderer, no bindings. The delta between
 * the two screens is therefore the engine's cost and nothing else.
 */
export const HomeScreenStatic: React.FC<Props> = ({ navigation }) => {
  const { onRootLayout, onLastSectionLayout } = useScreenTimings(PERF_NAME);
  const [selectedChip, setSelectedChip] = useState('all');
  const [tenure, setTenure] = useState('36');
  const [emi, setEmi] = useState('18,450');
  const [wishlist, setWishlist] = useState<string[]>([]);

  const matches = (car: StaticCar) => selectedChip === 'all' || car.category === selectedChip;
  const toggleWishlist = (id: string) =>
    setWishlist(previous =>
      previous.includes(id) ? previous.filter(entry => entry !== id) : [...previous, id],
    );
  const openDetails = (car: StaticCar) =>
    navigation.navigate('CarDetails', { car: { ...car, fuel: car.fuelType, owner: '1st Owner' } });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <PerfBar perfName={PERF_NAME} mode="static" />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Same content-anchored TTR measurement as the SDUI screen */}
        <View onLayout={onRootLayout}>
          <HeaderComponent {...STATIC_HEADER_DATA} />

          <ChipGroupComponent
            items={STATIC_CHIPS_DATA}
            selected={selectedChip}
            onSelect={chip => setSelectedChip(chip.id)}
          />

          <BannerComponent {...STATIC_BANNER_DATA} />

          <CarouselComponent
            title="⚡ Hot Picks Today"
            subtitle="Handpicked quality cars in Gurgaon, NCR"
            itemWidth={270}
          >
            {STATIC_FEATURED_CARS.filter(matches).map(car => (
              <CarCardComponent
                key={car.id}
                {...car}
                isWishlisted={wishlist.includes(car.id)}
                onWishlistPress={() => toggleWishlist(car.id)}
                onPress={() => openDetails(car)}
              />
            ))}
          </CarouselComponent>

          <CardNode style={styles.emiCard}>
            <TextNode text="💰 EMI Calculator" variant="sectionTitle" />
            <SpacerNode height={10} />
            <SegmentedControlNode
              segments={STATIC_TENURES}
              selected={tenure}
              onSelect={segment => {
                setTenure(segment.id);
                setEmi((segment as { emi?: string }).emi ?? '');
              }}
            />
            <SpacerNode height={12} />
            <KeyValueRowNode label="Tenure" value={`${tenure} months`} />
            <DividerNode />
            <KeyValueRowNode label="Monthly EMI" value={`₹${emi}`} emphasis />
          </CardNode>

          <GridComponent
            title="🔥 Popular Near You"
            subtitle="Verified cars with free home delivery"
            columns={2}
            gap={12}
          >
            {STATIC_POPULAR_CARS.filter(matches).map(car => (
              <CarCardComponent
                key={car.id}
                {...car}
                isWishlisted={wishlist.includes(car.id)}
                onWishlistPress={() => toggleWishlist(car.id)}
                onPress={() => openDetails(car)}
              />
            ))}
          </GridComponent>

          <RowNode gap={10} paddingHorizontal={16} style={styles.valueProps}>
            {STATIC_VALUE_PROPS.map(item => (
              <StatTileNode key={item.label} {...item} />
            ))}
          </RowNode>

          <BannerComponent
            title="Sell Your Car in 1 Hour"
            subtitle="Instant quote & payment at your doorstep"
            ctaText="Get Free Valuation"
            badge="INSTANT CASH"
            backgroundColor={COLORS.primary}
            textColor={COLORS.buttonText}
          />

          <SpacerNode height={40} />
          <View onLayout={onLastSectionLayout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.chromeBg,
  },
  scroll: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  scrollContainer: {
    paddingBottom: vs(24),
  },
  emiCard: {
    marginHorizontal: hs(16),
    marginVertical: vs(8),
  },
  valueProps: {
    marginVertical: vs(8),
  },
});
