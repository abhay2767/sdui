import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SDUIProvider } from './src/sdui/context/SDUIContext';
import { HomeScreenSDUI } from './src/screens/HomeScreenSDUI';
import { HomeScreenStatic } from './src/screens/HomeScreenStatic';
import { CarDetailsScreen } from './src/screens/CarDetailsScreen';
import { PerfScreen } from './src/screens/PerfScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <SDUIProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#0F172A"
          translucent={false}
        />
        <NavigationContainer>
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
        </NavigationContainer>
      </SDUIProvider>
    </SafeAreaProvider>
  );
}
