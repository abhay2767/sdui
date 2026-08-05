import React from 'react';
import { Image, View, Text, StyleSheet, StyleProp, ImageStyle, ViewStyle } from 'react-native';
import { COLORS, RADIUS, vs, msc } from '../tokens';

interface Props {
  uri?: string;
  height?: number;
  width?: number | string;
  aspectRatio?: number;
  radius?: number;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  /** Shown while the image is missing or failed — keeps layout from jumping. */
  placeholder?: string;
  style?: StyleProp<ImageStyle>;
}

export const ImageNode: React.FC<Props> = React.memo(
  ({ uri, height, width = '100%', aspectRatio, radius = RADIUS.md, resizeMode = 'cover', placeholder = '🚘', style }) => {
    const [failed, setFailed] = React.useState(false);

    // Server-sent heights are design-spec px; scale them vertically.
    const resolvedHeight = aspectRatio ? undefined : vs(height ?? 160);

    const frame = {
      height: resolvedHeight,
      width,
      aspectRatio,
      borderRadius: radius,
    } as ViewStyle;

    if (!uri || failed) {
      return (
        <View style={[styles.placeholder, frame]}>
          <Text style={styles.placeholderGlyph}>{placeholder}</Text>
        </View>
      );
    }

    return (
      <Image
        source={{ uri, cache: 'force-cache' }}
        resizeMode={resizeMode}
        onError={() => setFailed(true)}
        style={[frame as ImageStyle, style]}
      />
    );
  },
);

ImageNode.displayName = 'ImageNode';

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: COLORS.skeletonBase,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderGlyph: {
    fontSize: msc(36),
  },
});
