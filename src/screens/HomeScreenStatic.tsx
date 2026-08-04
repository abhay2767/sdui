import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderComponent } from '../sdui/components/HeaderComponent';
import { ChipGroupComponent } from '../sdui/components/ChipGroupComponent';
import { BannerComponent } from '../sdui/components/BannerComponent';
import { CarouselComponent } from '../sdui/components/CarouselComponent';
import { CarCardComponent } from '../sdui/components/CarCardComponent';
import { GridComponent } from '../sdui/components/GridComponent';
import { SpacerComponent } from '../sdui/components/SpacerComponent';
import { BottomSheetComponent } from '../sdui/components/BottomSheetComponent';
import { useSDUI } from '../sdui/context/SDUIContext';
import {
  STATIC_HEADER_DATA,
  STATIC_CHIPS_DATA,
  STATIC_BANNER_DATA,
  STATIC_FEATURED_CARS,
  STATIC_POPULAR_CARS,
} from '../data/staticHomeData';
import { perfTracker, getCurrentTimeMs } from '../sdui/utils/perf';

interface HomeScreenStaticProps {
  navigation: any;
}

export const HomeScreenStatic: React.FC<HomeScreenStaticProps> = ({ navigation }) => {
  const [selectedChip, setSelectedChip] = useState('all');
  const [renderTimeMs, setRenderTimeMs] = useState(0);
  const { openBottomSheet } = useSDUI();

  useEffect(() => {
    const start = getCurrentTimeMs();
    // Simulate static mount render time
    const end = getCurrentTimeMs();
    const duration = end - start;

    setRenderTimeMs(duration);
    perfTracker.recordMetric({
      name: 'STATIC_HOME_SCREEN',
      parseTimeMs: 0.0,
      renderTimeMs: duration,
      totalTimeMs: duration,
      nodeCount: 12,
      timestamp: new Date().toISOString(),
    });
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Performance Bar */}
      <View style={styles.perfBar}>
        <View style={styles.perfItem}>
          <Text style={styles.perfLabel}>Static Mode</Text>
          <Text style={styles.perfValue}>Hardcoded UI</Text>
        </View>
        <View style={styles.perfDivider} />
        <View style={styles.perfItem}>
          <Text style={styles.perfLabel}>Total TTR</Text>
          <Text style={styles.perfValueHighlight}>{renderTimeMs.toFixed(2)}ms</Text>
        </View>
        <View style={styles.perfDivider} />
        <TouchableOpacity
          style={styles.benchmarkBtn}
          onPress={() => navigation.navigate('PerfBenchmark')}
        >
          <Text style={styles.benchmarkBtnText}>📊 Compare</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Section 1: Header */}
        <HeaderComponent
          {...STATIC_HEADER_DATA}
          onLocationPress={() =>
            openBottomSheet('📍 Select City / Location', 'Choose your location: Gurgaon, Delhi NCR, Mumbai, Bengaluru, Hyderabad')
          }
          onSearchPress={() =>
            openBottomSheet('🔍 Search Used Cars', 'Search by brand or model (e.g. Swift, Creta, City, Nexon).')
          }
          onFilterPress={() =>
            openBottomSheet('⚙️ Car Filter Settings', 'Filter options: Price, Fuel Type, Transmission, Year.')
          }
        />

        {/* Section 2: Chip Group */}
        <ChipGroupComponent
          items={STATIC_CHIPS_DATA}
          selectedId={selectedChip}
          onSelect={chip => setSelectedChip(chip.id)}
        />

        {/* Section 3: Banner */}
        <BannerComponent {...STATIC_BANNER_DATA} />

        {/* Section 4: Carousel */}
        <CarouselComponent title="⚡ Hot Picked Cars Today" subtitle="Handpicked top quality cars near Gurgaon">
          {STATIC_FEATURED_CARS.map(car => (
            <CarCardComponent
              key={car.id}
              {...car}
              onPress={() => navigation.navigate('CarDetails', { carId: car.id, title: car.title, price: car.price })}
            />
          ))}
        </CarouselComponent>

        {/* Section 5: Grid */}
        <GridComponent title="🔥 Popular Cars Near You" subtitle="Verified used cars with free home delivery">
          {STATIC_POPULAR_CARS.map(car => (
            <CarCardComponent
              key={car.id}
              {...car}
              onPress={() => navigation.navigate('CarDetails', { carId: car.id, title: car.title, price: car.price })}
            />
          ))}
        </GridComponent>

        <SpacerComponent height={40} />
      </ScrollView>

      <BottomSheetComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  perfBar: {
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  perfItem: {
    flexDirection: 'column',
  },
  perfLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  perfValue: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  perfValueHighlight: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  perfDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#334155',
  },
  benchmarkBtn: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  benchmarkBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  scrollContainer: {
    backgroundColor: '#F8FAFC',
    paddingBottom: 24,
  },
});
