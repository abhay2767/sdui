import React, { useEffect, useReducer } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { perfStore, ScreenTimings, FrameStats } from '../sdui/utils/perf';
import { logger, LogEntry } from '../sdui/utils/logger';
import type { RootStackParamList } from '../navigation/navigationRef';
import { COLORS, RADIUS, FONTS, hs, vs, msc } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PerfBenchmark'>;

const SDUI_KEY = 'SDUI_HOME';
const STATIC_KEY = 'STATIC_HOME';

function formatMs(value?: number): string {
  return value !== undefined ? `${value.toFixed(1)} ms` : 'not measured';
}

/**
 * Live benchmark viewer.
 *
 * Every number on this screen comes from perfStore, which only records phases
 * that actually happened. Anything not yet measured renders as "not measured" —
 * there are no placeholder values. To fill the static column, open the Static
 * screen first (button below), then come back.
 */
export const PerfScreen: React.FC<Props> = ({ navigation }) => {
  const [, forceRender] = useReducer(count => count + 1, 0);
  useEffect(() => perfStore.subscribe(forceRender), []);

  const sdui = perfStore.screen(SDUI_KEY);
  const stat = perfStore.screen(STATIC_KEY);
  const sduiFrames = perfStore.frames(SDUI_KEY);
  const statFrames = perfStore.frames(STATIC_KEY);
  const logs = logger.getLogs();

  const overhead = (metric: keyof ScreenTimings): string => {
    const a = stat?.[metric];
    const b = sdui?.[metric];
    if (typeof a !== 'number' || typeof b !== 'number') return '—';
    const delta = b - a;
    const pct = a > 0 ? ` (${delta >= 0 ? '+' : ''}${((delta / a) * 100).toFixed(0)}%)` : '';
    return `${delta >= 0 ? '+' : ''}${delta.toFixed(1)} ms${pct}`;
  };

  const row = (label: string, staticValue: string, sduiValue: string, delta?: string) => (
    <View style={styles.tableRow} key={label}>
      <Text style={[styles.cell, styles.colName]}>{label}</Text>
      <Text style={[styles.cell, styles.colVal]}>{staticValue}</Text>
      <Text style={[styles.cell, styles.colVal]}>{sduiValue}</Text>
      <Text style={[styles.cell, styles.colVal, styles.deltaText]}>{delta ?? ''}</Text>
    </View>
  );

  const frameLine = (name: string, stats?: FrameStats) =>
    stats
      ? `${name}: ${stats.fps.toFixed(1)} fps · ${stats.drops} dropped · worst ${stats.worstFrameMs.toFixed(0)}ms over ${(stats.durationMs / 1000).toFixed(1)}s`
      : `${name}: not sampled — tap "🎞 5s frames" on that screen while scrolling`;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>⚡ Benchmark</Text>
        <TouchableOpacity onPress={() => navigation.navigate('HomeStatic')}>
          <Text style={styles.refreshText}>Open Static ↗</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionHeader}>Static baseline vs SDUI engine</Text>
        <Text style={styles.methodNote}>
          Same device, same session, same leaf components, same measurement
          hooks. Values appear only after each screen has actually been opened
          and measured — nothing here is precomputed.
        </Text>

        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.colName, styles.headerText]}>Metric</Text>
            <Text style={[styles.cell, styles.colVal, styles.headerText]}>Static</Text>
            <Text style={[styles.cell, styles.colVal, styles.headerText]}>SDUI</Text>
            <Text style={[styles.cell, styles.colVal, styles.headerText]}>Overhead</Text>
          </View>
          {row('JSON parse', 'n/a', formatMs(sdui?.parseMs))}
          {row('Schema prep', 'n/a', formatMs(sdui?.prepareMs))}
          {row('TTR (above fold)', formatMs(stat?.ttrMs), formatMs(sdui?.ttrMs), overhead('ttrMs'))}
          {row('TTI (tappable)', formatMs(stat?.ttiMs), formatMs(sdui?.ttiMs), overhead('ttiMs'))}
          {row('Full page', formatMs(stat?.fullPageMs), formatMs(sdui?.fullPageMs), overhead('fullPageMs'))}
          {row(
            'Node count',
            stat ? '—' : 'not measured',
            sdui?.nodeCount !== undefined ? String(sdui.nodeCount) : 'not measured',
          )}
        </View>

        <Text style={styles.sectionHeader}>Scroll performance</Text>
        <View style={styles.frameCard}>
          <Text style={styles.frameLine}>{frameLine('SDUI', sduiFrames)}</Text>
          <Text style={styles.frameLine}>{frameLine('Static', statFrames)}</Text>
        </View>

        <Text style={styles.sectionHeader}>📋 Engine event log</Text>
        <View style={styles.logConsole}>
          {logs.length === 0 ? (
            <Text style={styles.logEmpty}>No events yet.</Text>
          ) : (
            logs.slice(0, 20).map((log: LogEntry, index: number) => (
              <View key={index} style={styles.logRow}>
                <Text style={styles.logTime}>[{log.timestamp.split('T')[1]?.slice(0, 8)}]</Text>
                <Text
                  style={[
                    styles.logTag,
                    log.level === 'warn' || log.level === 'error' ? styles.logTagWarn : null,
                  ]}
                >
                  [{log.tag}]
                </Text>
                <Text style={styles.logMsg}>{log.message}</Text>
              </View>
            ))
          )}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: hs(16),
    paddingVertical: vs(10),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.chromeLine,
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
    fontWeight: '800',
  },
  refreshText: {
    color: COLORS.info,
    fontSize: msc(13),
    fontWeight: '600',
  },
  scroll: {
    padding: hs(16),
  },
  sectionHeader: {
    fontSize: msc(15),
    fontWeight: '800',
    color: COLORS.onDark,
    marginTop: vs(12),
    marginBottom: vs(8),
  },
  methodNote: {
    fontSize: msc(12),
    color: COLORS.faint,
    lineHeight: msc(17),
    marginBottom: vs(10),
  },
  tableCard: {
    backgroundColor: COLORS.chromeSurface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.inkSoft,
    marginBottom: vs(8),
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.chromeBg,
    paddingVertical: vs(12),
    paddingHorizontal: hs(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inkSoft,
  },
  headerText: {
    fontWeight: '800',
    color: COLORS.faint,
    fontSize: msc(11),
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: vs(10),
    paddingHorizontal: hs(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.chromeBg,
  },
  cell: {
    fontSize: msc(11),
    color: COLORS.line,
  },
  colName: {
    flex: 1.6,
  },
  colVal: {
    flex: 1,
    textAlign: 'right',
  },
  deltaText: {
    color: COLORS.warning,
    fontWeight: '700',
  },
  frameCard: {
    backgroundColor: COLORS.chromeSurface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.inkSoft,
    padding: hs(14),
    marginBottom: vs(8),
  },
  frameLine: {
    fontSize: msc(12),
    color: COLORS.line,
    fontFamily: FONTS.mono,
    marginBottom: vs(6),
  },
  logConsole: {
    backgroundColor: '#020617',
    borderRadius: RADIUS.md,
    padding: hs(12),
    borderWidth: 1,
    borderColor: COLORS.chromeLine,
    maxHeight: vs(280),
  },
  logEmpty: {
    color: COLORS.muted,
    fontSize: msc(12),
    fontStyle: 'italic',
  },
  logRow: {
    flexDirection: 'row',
    marginBottom: vs(6),
    flexWrap: 'wrap',
  },
  logTime: {
    color: COLORS.muted,
    fontSize: msc(10),
    fontFamily: FONTS.mono,
    marginRight: hs(6),
  },
  logTag: {
    color: COLORS.info,
    fontSize: msc(10),
    fontWeight: '700',
    fontFamily: FONTS.mono,
    marginRight: hs(6),
  },
  logTagWarn: {
    color: COLORS.warning,
  },
  logMsg: {
    color: COLORS.line,
    fontSize: msc(11),
    fontFamily: FONTS.mono,
  },
});
