import React from 'react';
import { View, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { COLORS, RADIUS, color, hs, vs } from '../tokens';

interface StackProps {
  gap?: number;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  wrap?: boolean;
  background?: string;
  radius?: number;
  flex?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/** Server-sent spacing values are design-spec px; scale them per axis. */
function stackStyle(direction: 'row' | 'column', props: StackProps): ViewStyle {
  return {
    flexDirection: direction,
    gap: props.gap !== undefined ? hs(props.gap) : undefined,
    padding: props.padding !== undefined ? hs(props.padding) : undefined,
    paddingHorizontal:
      props.paddingHorizontal !== undefined ? hs(props.paddingHorizontal) : undefined,
    paddingVertical: props.paddingVertical !== undefined ? vs(props.paddingVertical) : undefined,
    alignItems: props.align,
    justifyContent: props.justify,
    flexWrap: props.wrap ? 'wrap' : undefined,
    backgroundColor: props.background ? color(props.background, COLORS.transparent) : undefined,
    borderRadius: props.radius,
    flex: props.flex,
  };
}

/** Horizontal stack. */
export const RowNode: React.FC<StackProps> = React.memo(({ style, children, ...rest }) => (
  <View style={[stackStyle('row', rest), style]}>{children}</View>
));
RowNode.displayName = 'RowNode';

/** Vertical stack. */
export const ColumnNode: React.FC<StackProps> = React.memo(({ style, children, ...rest }) => (
  <View style={[stackStyle('column', rest), style]}>{children}</View>
));
ColumnNode.displayName = 'ColumnNode';

interface CardProps extends StackProps {
  elevated?: boolean;
  bordered?: boolean;
}

/** A surface with the app's standard card treatment. */
export const CardNode: React.FC<CardProps> = React.memo(
  ({ elevated = true, bordered = true, style, children, ...rest }) => (
    <View
      style={[
        cardStyles.base,
        bordered && cardStyles.bordered,
        elevated && cardStyles.elevated,
        stackStyle('column', { padding: 14, radius: RADIUS.lg, ...rest }),
        style,
      ]}
    >
      {children}
    </View>
  ),
);
CardNode.displayName = 'CardNode';

interface DividerProps {
  inset?: number;
  thickness?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const DividerNode: React.FC<DividerProps> = React.memo(
  ({ inset = 0, thickness = StyleSheet.hairlineWidth, color: colorProp, style }) => (
    <View
      style={[
        {
          height: thickness,
          marginHorizontal: hs(inset),
          backgroundColor: color(colorProp, COLORS.line),
        },
        style,
      ]}
    />
  ),
);
DividerNode.displayName = 'DividerNode';

interface SpacerProps {
  height?: number;
  width?: number;
  background?: string;
  style?: StyleProp<ViewStyle>;
}

export const SpacerNode: React.FC<SpacerProps> = React.memo(
  ({ height = 16, width, background, style }) => (
    <View
      style={[
        {
          height: vs(height),
          width: width !== undefined ? hs(width) : undefined,
          backgroundColor: background ? color(background, COLORS.transparent) : undefined,
        },
        style,
      ]}
    />
  ),
);
SpacerNode.displayName = 'SpacerNode';

const cardStyles = StyleSheet.create({
  base: {
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
  bordered: {
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  elevated: {
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});
