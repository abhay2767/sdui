import React, { useEffect } from 'react';
import { Animated, DimensionValue, Easing, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { COLORS, RADIUS } from '../tokens';

interface Props {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Shimmer atom. One shared Animated.Value drives every skeleton block on
 * screen, so 30 placeholders cost one animation loop, not 30 — and the pulse
 * is phase-synchronized, which reads as one loading surface instead of
 * twinkling confetti.
 *
 * The loop is refcounted: it starts when the first skeleton mounts and stops
 * when the last one unmounts, so a loaded app runs zero loading animations.
 *
 * Opacity-pulse rather than a translating gradient: a real gradient shimmer
 * needs react-native-linear-gradient (native dep). Deliberate trade-off to
 * keep the project dependency-light; the seam to upgrade is this one file.
 */
const pulse = new Animated.Value(0.4);
let activeCount = 0;
let loop: Animated.CompositeAnimation | null = null;

function retain() {
  activeCount += 1;
  if (activeCount === 1) {
    loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
  }
}

function release() {
  activeCount -= 1;
  if (activeCount === 0) {
    loop?.stop();
    loop = null;
    pulse.setValue(0.4);
  }
}

export const Skeleton: React.FC<Props> = React.memo(
  ({ width = '100%', height = 16, radius = RADIUS.sm, style }) => {
    useEffect(() => {
      retain();
      return release;
    }, []);

    return (
      <Animated.View
        style={[
          styles.base,
          { width, height, borderRadius: radius, opacity: pulse },
          style,
        ]}
      />
    );
  },
);

Skeleton.displayName = 'Skeleton';

const styles = StyleSheet.create({
  base: {
    backgroundColor: COLORS.skeletonBase,
  },
});
