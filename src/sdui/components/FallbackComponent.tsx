import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { logger } from '../utils/logger';

interface FallbackComponentProps {
  type: string;
  [key: string]: any;
}

export const FallbackComponent: React.FC<FallbackComponentProps> = ({ type }) => {
  React.useEffect(() => {
    logger.error('UNKNOWN_COMPONENT', `Failed to render component type: "${type}". Graceful fallback rendered.`);
  }, [type]);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.warningIcon}>⚠️</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Unsupported Widget</Text>
        <Text style={styles.subtitle}>
          Component type <Text style={styles.typeHighlight}>"{type}"</Text> is not supported by your app version.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 14,
    backgroundColor: '#FFF4E5',
    borderWidth: 1,
    borderColor: '#FFE0B2',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  warningIcon: {
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E65100',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#BF360C',
  },
  typeHighlight: {
    fontWeight: '700',
    fontFamily: 'monospace',
  },
});
