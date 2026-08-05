import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { COLORS, RADIUS, color, hs, vs, msc, FONTS } from '../tokens';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props {
  label?: string;
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  background?: string;
  textColor?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const VARIANTS: Record<Variant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: COLORS.primary, fg: COLORS.buttonText },
  secondary: { bg: COLORS.primarySoft, fg: COLORS.primary, border: '#FFEDD5' },
  ghost: { bg: COLORS.transparent, fg: COLORS.inkSoft, border: COLORS.line },
  danger: { bg: COLORS.danger, fg: COLORS.buttonText },
};

const SIZES = {
  sm: { paddingVertical: vs(7), paddingHorizontal: hs(12), fontSize: msc(12) },
  md: { paddingVertical: vs(11), paddingHorizontal: hs(18), fontSize: msc(14) },
  lg: { paddingVertical: vs(15), paddingHorizontal: hs(24), fontSize: msc(16) },
} as const;

export const ButtonNode: React.FC<Props> = React.memo(
  ({ label = 'Button', variant = 'primary', size = 'md', fullWidth, disabled, background, textColor, onPress, style }) => {
    const palette = VARIANTS[variant] ?? VARIANTS.primary;
    const dimensions = SIZES[size] ?? SIZES.md;

    return (
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.85}
        disabled={disabled}
        onPress={onPress}
        style={[
          styles.base,
          {
            backgroundColor: color(background, palette.bg),
            borderColor: palette.border ?? COLORS.transparent,
            borderWidth: palette.border ? 1 : 0,
            paddingVertical: dimensions.paddingVertical,
            paddingHorizontal: dimensions.paddingHorizontal,
            alignSelf: fullWidth ? 'stretch' : 'flex-start',
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
      >
        <Text
          style={[
            styles.label,
            { color: color(textColor, palette.fg), fontSize: dimensions.fontSize },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  },
);

ButtonNode.displayName = 'ButtonNode';

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: FONTS.medium,
    fontWeight: '700',
  },
});
