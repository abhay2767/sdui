import React from 'react';
import { View } from 'react-native';

interface SpacerComponentProps {
  height?: number;
  width?: number;
  backgroundColor?: string;
}

export const SpacerComponent: React.FC<SpacerComponentProps> = ({
  height = 16,
  width,
  backgroundColor = 'transparent',
}) => {
  return <View style={{ height, width, backgroundColor }} />;
};
