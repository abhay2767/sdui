import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

interface ContainerComponentProps {
  children?: React.ReactNode;
  style?: any;
  onPress?: () => void;
}

export const ContainerComponent: React.FC<ContainerComponentProps> = ({
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
};

const styles = StyleSheet.create({
  default: {
    paddingHorizontal: 16,
  },
});
