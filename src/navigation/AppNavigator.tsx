import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, TabParamList } from './types';
import { useLocalization } from '../context/LocalizationContext';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// --- STACK UNTUK HOME (BERANDA) ---
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false 
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
  );
}

// --- STACK UNTUK FAVORITES ---
function FavoritesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="FavoritesMain" component={FavoritesScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
  );
}

// --- STACK UNTUK PENGATURAN ---
function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

// --- NAVIGATOR UTAMA (TAB) ---
export default function AppNavigator() {
  const { t } = useLocalization(); 

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help-circle';
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        
        tabBarActiveTintColor: '#FFFFFF', 
        tabBarInactiveTintColor: '#A5D6A7',
        
        
        tabBarLabelStyle: {
        },
        
        tabBarStyle: {
          backgroundColor: '#4CAF50',
          borderTopWidth: 0,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ title: t('tabs.home') }} // 'title' ini akan digunakan sebagai label
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesStack}
        options={{ title: t('tabs.favorites') }} // 'title' ini akan digunakan sebagai label
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{ title: t('tabs.settings') }} // 'title' ini akan digunakan sebagai label
      />
    </Tab.Navigator>
  );
}