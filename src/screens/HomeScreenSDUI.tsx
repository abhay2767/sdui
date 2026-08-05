import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SDUIRenderer, SDUIPageProvider } from '../sdui/renderer/Renderer';
import { useSDUIPage } from '../sdui/hooks/useSDUIPage';
import { useScreenTimings } from '../sdui/utils/useScreenTimings';
import { SkeletonHomePage } from '../sdui/components/skeletons/PageSkeletons';
import { PerfBar } from '../components/PerfBar';
import type { RootStackParamList } from '../navigation/navigationRef';
import { COLORS, hs, vs, msc } from '../theme';

const PERF_NAME = 'SDUI_HOME';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeSDUI'>;

/**
 * The SDUI-driven home screen. Screen code is deliberately thin: fetch the
 * payload, hand it to the renderer, host the shared chrome (perf bar,
 * skeleton). Everything the user sees below the perf bar comes from
 * homeSDUI.json.
 */
export const HomeScreenSDUI: React.FC<Props> = () => {
  // onRootLayout is attached to the *content* container (mounted only once
  // the payload arrived), so TTR measures real sections — never the skeleton.
  const { onRootLayout, onLastSectionLayout } = useScreenTimings(PERF_NAME);
  const { schema, unsupportedReason, error } = useSDUIPage('home', PERF_NAME);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <PerfBar perfName={PERF_NAME} mode="sdui" />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {schema?.page ? (
          <View onLayout={onRootLayout}>
            <SDUIPageProvider theme={schema.theme}>
              <SDUIRenderer nodes={schema.page} />
              {/* Fires when the last SDUI section has been laid out */}
              <View onLayout={onLastSectionLayout} />
            </SDUIPageProvider>
          </View>
        ) : unsupportedReason ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageTitle}>Please update your app</Text>
            <Text style={styles.messageText}>{unsupportedReason}</Text>
          </View>
        ) : error ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageTitle}>Couldn't load this page</Text>
            <Text style={styles.messageText}>{error}</Text>
          </View>
        ) : (
          <SkeletonHomePage />
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
  scroll: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  scrollContainer: {
    paddingBottom: vs(24),
  },
  messageBox: {
    padding: hs(32),
    alignItems: 'center',
  },
  messageTitle: {
    fontSize: msc(16),
    fontWeight: '800',
    color: COLORS.ink,
    marginBottom: vs(6),
  },
  messageText: {
    color: COLORS.muted,
    fontSize: msc(13),
    textAlign: 'center',
  },
});
