import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { logger } from '../sdui/utils/logger';
import { COLORS, RADIUS, hs, vs, msc } from '../theme';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
  /** Bumped on retry so the subtree fully remounts. */
  attempt: number;
}

/**
 * App-root boundary. Per-node boundaries contain payload-driven crashes to a
 * single section; this catches everything else (screen chrome, navigation,
 * providers) so the worst case is a branded retry screen, never a white
 * screen.
 */
export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null, attempt: 0 };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error) {
    logger.error('APP_CRASH', `Uncaught render error: ${error.message}`, {
      stack: error.stack,
    });
  }

  private retry = () => {
    this.setState(previous => ({ error: null, attempt: previous.attempt + 1 }));
  };

  render() {
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <Text style={styles.logo}>CARS24</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.subtitle}>
            The app hit an unexpected error. Your data is safe — try again.
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.button}
            onPress={this.retry}
          >
            <Text style={styles.buttonText}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    // key remounts the whole tree after a retry, clearing any broken state
    return <View key={this.state.attempt} style={styles.fill}>{this.props.children}</View>;
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.chromeBg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: hs(32),
  },
  logo: {
    color: COLORS.primary,
    fontSize: msc(28),
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: vs(24),
  },
  title: {
    color: COLORS.onDark,
    fontSize: msc(18),
    fontWeight: '800',
    marginBottom: vs(8),
  },
  subtitle: {
    color: COLORS.faint,
    fontSize: msc(13),
    textAlign: 'center',
    lineHeight: msc(19),
    marginBottom: vs(24),
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: hs(32),
    paddingVertical: vs(12),
    borderRadius: RADIUS.md,
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: msc(14),
    fontWeight: '800',
  },
});
