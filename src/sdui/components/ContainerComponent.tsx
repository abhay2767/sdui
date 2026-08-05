import React from 'react';
import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { universalPaddingHorizontal } from './tokens';

interface ContainerComponentProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const ContainerComponent: React.FC<ContainerComponentProps> = React.memo(({
  children,
  style,
  onPress,
}) => {
  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.9} style={[styles.default, style]} onPress={onPress}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.default, style]}>{children}</View>;
});

ContainerComponent.displayName = 'ContainerComponent';

const styles = StyleSheet.create({
  default: {
    paddingHorizontal: universalPaddingHorizontal,
  },
});
