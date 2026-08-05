import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { COLORS, TEXT_VARIANTS, TextVariant, color } from '../tokens';

interface Props {
  /** Also accepts `value`, so a payload can bind `"value": "{{state.emi}}"`. */
  text?: string | number;
  value?: string | number;
  variant?: TextVariant;
  color?: string;
  align?: TextStyle['textAlign'];
  numberOfLines?: number;
  uppercase?: boolean;
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

/**
 * The workhorse primitive. Takes a semantic variant rather than raw font
 * sizes — payloads stay short, typography stays consistent, and every size
 * flows through the responsive msc() scale in the theme.
 */
export const TextNode: React.FC<Props> = React.memo(
  ({ text, value, variant = 'body', color: colorProp, align, numberOfLines, uppercase, style, children }) => {
    const content = text ?? value ?? '';
    const variantStyle = (TEXT_VARIANTS[variant] ?? TEXT_VARIANTS.body) as TextStyle;

    return (
      <Text
        numberOfLines={numberOfLines}
        style={[
          variantStyle,
          { color: color(colorProp, COLORS.ink), textAlign: align },
          uppercase ? styles.uppercase : null,
          style,
        ]}
      >
        {content}
        {children}
      </Text>
    );
  },
);

TextNode.displayName = 'TextNode';

const styles = StyleSheet.create({
  uppercase: {
    textTransform: 'uppercase',
  },
});
