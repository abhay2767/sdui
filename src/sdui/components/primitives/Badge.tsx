import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { COLORS, RADIUS, color, hs, vs, msc } from '../tokens';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'primary';

interface Props {
  label?: string;
  tone?: Tone;
  icon?: string;
  background?: string;
  textColor?: string;
  pill?: boolean;
  style?: StyleProp<ViewStyle>;
}

const TONES: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: COLORS.line, fg: COLORS.inkSoft },
  success: { bg: COLORS.success, fg: COLORS.buttonText },
  warning: { bg: COLORS.warning, fg: COLORS.buttonText },
  danger: { bg: COLORS.danger, fg: COLORS.buttonText },
  info: { bg: COLORS.info, fg: '#062A38' },
  primary: { bg: COLORS.primary, fg: COLORS.buttonText },
};

export const BadgeNode: React.FC<Props> = React.memo(
  ({ label = '', tone = 'neutral', icon, background, textColor, pill = true, style }) => {
    const palette = TONES[tone] ?? TONES.neutral;
    return (
      <View
        style={[
          styles.badge,
          {
            backgroundColor: color(background, palette.bg),
            borderRadius: pill ? RADIUS.pill : RADIUS.sm,
          },
          style,
        ]}
      >
        <Text style={[styles.text, { color: color(textColor, palette.fg) }]}>
          {icon ? `${icon} ` : ''}
          {label}
        </Text>
      </View>
    );
  },
);

BadgeNode.displayName = 'BadgeNode';

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: hs(9),
    paddingVertical: vs(3),
  },
  text: {
    fontSize: msc(10),
    fontWeight: '800',
  },
});
