import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SDUIRenderer } from '../sdui/renderer/Renderer';
import { SDUIPageSchema } from '../sdui/types/schema';
import { perfTracker, getCurrentTimeMs } from '../sdui/utils/perf';
import { logger } from '../sdui/utils/logger';
import { isSchemaSupported } from '../sdui/utils/versioning';
import homeJsonRaw from '../data/homeSDUI.json';
import { BottomSheetComponent } from '../sdui/components/BottomSheetComponent';

interface HomeScreenSDUIProps {
  navigation: any;
}

export const HomeScreenSDUI: React.FC<HomeScreenSDUIProps> = ({ navigation }) => {
  const [schema, setSchema] = useState<SDUIPageSchema | null>(null);
  const [metrics, setMetrics] = useState({
    parseTimeMs: 0,
    renderTimeMs: 0,
    totalTimeMs: 0,
    nodeCount: 0,
  });

  useEffect(() => {
    // Measure JSON Parse Time
    const parseStart = getCurrentTimeMs();
    const parsedData: SDUIPageSchema = JSON.parse(JSON.stringify(homeJsonRaw));
    const parseEnd = getCurrentTimeMs();
    const parseTimeMs = parseEnd - parseStart;

    // Check version compatibility
    isSchemaSupported(parsedData.version);

    // Count nodes
    const countNodes = (nodes: any[]): number => {
      let count = nodes.length;
      for (const n of nodes) {
        if (n.children && Array.isArray(n.children)) {
          count += countNodes(n.children);
        }
      }
      return count;
    };
    const totalNodes = parsedData.page ? countNodes(parsedData.page) : 0;

    // Measure Render Setup Time
    const renderStart = getCurrentTimeMs();
    setSchema(parsedData);
    const renderEnd = getCurrentTimeMs();
    const renderTimeMs = renderEnd - renderStart;

    const totalTimeMs = parseTimeMs + renderTimeMs;

    const perfRecord = {
      name: 'SDUI_HOME_SCREEN',
      parseTimeMs,
      renderTimeMs,
      totalTimeMs,
      nodeCount: totalNodes,
      timestamp: new Date().toISOString(),
    };

    perfTracker.recordMetric(perfRecord);
    setMetrics({
      parseTimeMs,
      renderTimeMs,
      totalTimeMs,
      nodeCount: totalNodes,
    });
    logger.info('SDUI_RENDER', `SDUI Home Page Rendered ${totalNodes} nodes in ${totalTimeMs.toFixed(2)}ms`);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Floating Performance Metric Overlay Bar */}
      <View style={styles.perfBar}>
        <View style={styles.perfItem}>
          <Text style={styles.perfLabel}>SDUI Mode</Text>
          <Text style={styles.perfValue}>Parse: {metrics.parseTimeMs.toFixed(2)}ms</Text>
        </View>
        <View style={styles.perfDivider} />
        <View style={styles.perfItem}>
          <Text style={styles.perfLabel}>Total TTR</Text>
          <Text style={styles.perfValueHighlight}>{metrics.totalTimeMs.toFixed(2)}ms</Text>
        </View>
        <View style={styles.perfDivider} />
        <TouchableOpacity
          style={styles.benchmarkBtn}
          onPress={() => navigation.navigate('PerfBenchmark')}
        >
          <Text style={styles.benchmarkBtnText}>📊 Compare</Text>
        </TouchableOpacity>
      </View>

      {/* Main Scrollable SDUI Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {schema && schema.page ? (
          <SDUIRenderer nodes={schema.page} navigation={navigation} />
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading SDUI Engine...</Text>
          </View>
        )}
      </ScrollView>

      {/* Interactive Bottom Sheet Modal */}
      <BottomSheetComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  perfBar: {
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  perfItem: {
    flexDirection: 'column',
  },
  perfLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  perfValue: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  perfValueHighlight: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  perfDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#334155',
  },
  benchmarkBtn: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  benchmarkBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  scrollContainer: {
    paddingBottom: 24,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    color: '#64748B',
    fontSize: 14,
  },
});
