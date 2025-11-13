import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator'; // <-- Pastikan TANPA { }
import { StatusBar } from 'expo-status-bar';
import { LocalizationProvider } from './context/LocalizationContext'; // <-- Pastikan DENGAN { }

export default function App() { // <-- Ini adalah 'export default'
  return (
    <LocalizationProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    </LocalizationProvider>
  );
}