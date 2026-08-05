import React, { useMemo, useRef } from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  Modal,
  PanResponder,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSDUI } from '../context/SDUIContext';
import { SDUIRenderer } from '../renderer/Renderer';
import { COLORS, RADIUS, hs, vs, msc } from './tokens';

/**
 * Host for the OPEN_BOTTOM_SHEET action.
 *
 * The sheet body is itself SDUI: if the action payload carries `body` (a node
 * array), it renders through the same engine — which is how the EMI tenure
 * selector lives inside a sheet with zero sheet-specific client code. Plain
 * `title`/`content` strings remain supported for simple informational sheets.
 *
 * Safe area: the close button pads itself above the iOS home indicator /
 * Android gesture bar via live insets, so it is never clipped or overlapped.
 */
export const BottomSheetComponent: React.FC = () => {
  const { bottomSheet, closeBottomSheet } = useSDUI();
  const insets = useSafeAreaInsets();

  // Drag-to-dismiss: the handle area follows the finger downward; releasing
  // past the threshold closes, otherwise the sheet springs back. The handle
  // is a real affordance, not decoration.
  const dragY = useRef(new Animated.Value(0)).current;
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) =>
          Math.abs(gesture.dy) > 6 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onPanResponderMove: (_event, gesture) => {
          dragY.setValue(Math.max(0, gesture.dy));
        },
        onPanResponderRelease: (_event, gesture) => {
          if (gesture.dy > 80) {
            dragY.setValue(0);
            closeBottomSheet();
          } else {
            Animated.spring(dragY, { toValue: 0, useNativeDriver: true }).start();
          }
        },
      }),
    [dragY, closeBottomSheet],
  );

  if (!bottomSheet.visible) return null;

  return (
    <Modal
      transparent
      animationType="slide"
      visible={bottomSheet.visible}
      onRequestClose={closeBottomSheet}
    >
      <TouchableWithoutFeedback onPress={closeBottomSheet}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.sheetContent,
                { paddingBottom: Math.max(insets.bottom, vs(16)) },
                { transform: [{ translateY: dragY }] },
              ]}
            >
              <View style={styles.dragZone} {...panResponder.panHandlers}>
                <View style={styles.dragHandle} />
              </View>

              {bottomSheet.title ? (
                <Text style={styles.title}>{bottomSheet.title}</Text>
              ) : null}

              {bottomSheet.body ? (
                <ScrollView
                  style={styles.bodyScroll}
                  contentContainerStyle={styles.bodyContent}
                  showsVerticalScrollIndicator={false}
                >
                  <SDUIRenderer nodes={bottomSheet.body} />
                </ScrollView>
              ) : (
                <Text style={styles.bodyText}>
                  {bottomSheet.content || 'Action executed via SDUI engine.'}
                </Text>
              )}

              <TouchableOpacity
                accessibilityRole="button"
                style={styles.closeButton}
                onPress={closeBottomSheet}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  sheetContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: hs(20),
    minHeight: vs(200),
    maxHeight: '80%',
    alignItems: 'stretch',
  },
  dragZone: {
    // Generous touch target for the dismiss gesture
    paddingVertical: vs(6),
    marginTop: -vs(6),
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  dragHandle: {
    width: hs(40),
    height: vs(4),
    backgroundColor: '#CBD5E1',
    borderRadius: RADIUS.sm,
    marginBottom: vs(8),
  },
  title: {
    fontSize: msc(18),
    fontWeight: '800',
    color: COLORS.ink,
    marginBottom: vs(10),
    textAlign: 'center',
  },
  bodyScroll: {
    flexGrow: 0,
  },
  bodyContent: {
    paddingBottom: vs(8),
  },
  bodyText: {
    fontSize: msc(14),
    color: '#475569',
    textAlign: 'center',
    marginBottom: vs(20),
    lineHeight: msc(20),
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: vs(12),
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: vs(12),
  },
  closeButtonText: {
    color: COLORS.buttonText,
    fontWeight: '700',
    fontSize: msc(14),
  },
});
