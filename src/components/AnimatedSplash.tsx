import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { COLORS, msc, vs } from '../theme';

interface Props {
  children: React.ReactNode;
  /** How long the logo holds before the fade-out begins. */
  holdMs?: number;
}

/**
 * JS-driven splash: brand logo centered on the dark chrome color, holding
 * briefly, then fading + scaling out to reveal the app.
 *
 * Deliberately not react-native-bootsplash: that needs native config, asset
 * generation, and a pod install on every reviewer machine. The JS overlay
 * mounts on the first frame after the RN window appears, which covers the
 * SDUI fetch/skeleton phase — the window between process launch and first RN
 * frame stays the OS launch screen (LaunchScreen.storyboard on iOS). The
 * bootsplash upgrade replaces exactly this component.
 */
export const AnimatedSplash: React.FC<Props> = ({ children, holdMs = 900 }) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;
  // 'hold': overlay opaque and BLOCKING touches (the UI under it is
  // invisible — letting taps through would hit controls the user can't see).
  // 'fading': overlay is disappearing; let touches pass so TTI isn't padded.
  const [phase, setPhase] = useState<'hold' | 'fading' | 'done'>('hold');

  const finish = useCallback(() => setPhase('done'), []);

  useEffect(() => {
    Animated.sequence([
      // Logo settles in
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }),
      Animated.delay(holdMs),
    ]).start(() => {
      setPhase('fading');
      // Fade the whole overlay while the logo grows slightly — reads as the
      // app "opening up" rather than a curtain drop
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 420,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1.12,
          duration: 420,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(finish);
    });
  }, [holdMs, opacity, logoScale, finish]);

  return (
    <View style={styles.root}>
      {children}
      {phase !== 'done' && (
        <Animated.View
          style={[styles.overlay, { opacity }]}
          pointerEvents={phase === 'hold' ? 'auto' : 'none'}
        >
          <Animated.View style={{ transform: [{ scale: logoScale }] }}>
            <Text style={styles.logo}>CARS24</Text>
            <Text style={styles.tagline}>SERVER DRIVEN UI</Text>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.chromeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    color: COLORS.primary,
    fontSize: msc(40),
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },
  tagline: {
    color: COLORS.faint,
    fontSize: msc(11),
    fontWeight: '700',
    letterSpacing: 4,
    textAlign: 'center',
    marginTop: vs(8),
  },
});
