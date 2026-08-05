import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SDUIProvider } from './src/sdui/context/SDUIContext';
import { BottomSheetComponent } from './src/sdui/components/BottomSheetComponent';
import { AnimatedSplash } from './src/components/AnimatedSplash';
import { AppErrorBoundary } from './src/components/AppErrorBoundary';
import { navigationRef, RootStackParamList } from './src/navigation/navigationRef';
import { COLORS } from './src/theme';
import { HomeScreenSDUI } from './src/screens/HomeScreenSDUI';
import { HomeScreenStatic } from './src/screens/HomeScreenStatic';
import { CarDetailsScreen } from './src/screens/CarDetailsScreen';
import { PerfScreen } from './src/screens/PerfScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <AppErrorBoundary>
        <SDUIProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor={COLORS.chromeBg}
            translucent={false}
          />
          <AnimatedSplash>
            <NavigationContainer ref={navigationRef}>
              <Stack.Navigator
                initialRouteName="HomeSDUI"
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="HomeSDUI" component={HomeScreenSDUI} />
                <Stack.Screen name="HomeStatic" component={HomeScreenStatic} />
                <Stack.Screen name="CarDetails" component={CarDetailsScreen} />
                <Stack.Screen name="PerfBenchmark" component={PerfScreen} />
              </Stack.Navigator>
              {/* One sheet host for the whole app; OPEN_BOTTOM_SHEET works on any screen */}
              <BottomSheetComponent />
            </NavigationContainer>
          </AnimatedSplash>
        </SDUIProvider>
      </AppErrorBoundary>
    </SafeAreaProvider>
  );
}
