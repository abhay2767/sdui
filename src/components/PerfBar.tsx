import React, { useEffect, useReducer } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { perfStore, sampleFrames } from '../sdui/utils/perf';
import { navigationRef } from '../navigation/navigationRef';
import { COLORS, RADIUS, FONTS, hs, vs, msc } from '../theme';

interface Props {
  perfName: string;
  /** 'sdui' shows the parse phase; 'static' labels itself as the baseline. */
  mode: 'sdui' | 'static';
}

/**
 * The measurement strip above both home screens.
 *
 * Subscribes to perfStore itself, so a metric update re-renders ONLY this bar
 * — not the whole screen (and never the SDUI content below it). Values render
 * as an em dash until the phase has actually been measured.
 */
export const PerfBar: React.FC<Props> = React.memo(({ perfName, mode }) => {
  const [, forceRender] = useReducer(count => count + 1, 0);
  useEffect(() => perfStore.subscribe(forceRender), []);

  const timings = perfStore.screen(perfName);

  return (
    <View style={styles.bar}>
      <View>
        <Text style={styles.label}>
          {mode === 'sdui' ? 'SDUI · parse' : 'Static · baseline'}
        </Text>
        <Text style={styles.value}>
          {mode === 'sdui'
            ? timings?.parseMs !== undefined
              ? `${timings.parseMs.toFixed(1)}ms`
              : '—'
            : 'no engine'}
        </Text>
      </View>
      <View style={styles.divider} />
      <View>
        <Text style={styles.label}>TTR</Text>
        <Text style={styles.valueHighlight}>
          {timings?.ttrMs !== undefined ? `${timings.ttrMs.toFixed(0)}ms` : '—'}
        </Text>
      </View>
      <View style={styles.divider} />
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Sample scroll frames for five seconds"
        style={styles.action}
        onPress={() => sampleFrames(perfName)}
      >
        <Text style={styles.actionText}>🎞 5s frames</Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Open benchmark comparison"
        style={styles.action}
        onPress={() => {
          if (navigationRef.isReady()) {
            navigationRef.navigate('PerfBenchmark');
          }
        }}
      >
        <Text style={styles.actionText}>📊 Compare</Text>
      </TouchableOpacity>
    </View>
  );
});

PerfBar.displayName = 'PerfBar';

const styles = StyleSheet.create({
  bar: {
    backgroundColor: COLORS.chromeBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: hs(12),
    paddingVertical: vs(6),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.chromeLine,
  },
  label: {
    color: COLORS.faint,
    fontSize: msc(9),
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  value: {
    color: COLORS.info,
    fontSize: msc(11),
    fontWeight: '700',
    fontFamily: FONTS.mono,
  },
  valueHighlight: {
    color: COLORS.success,
    fontSize: msc(11),
    fontWeight: '800',
    fontFamily: FONTS.mono,
  },
  divider: {
    width: 1,
    height: vs(16),
    backgroundColor: COLORS.inkSoft,
  },
  action: {
    backgroundColor: COLORS.chromeSurface,
    paddingHorizontal: hs(8),
    paddingVertical: vs(4),
    borderRadius: RADIUS.sm,
  },
  actionText: {
    color: COLORS.onDark,
    fontSize: msc(10),
    fontWeight: '800',
  },
});
