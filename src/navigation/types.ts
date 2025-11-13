import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Definisikan semua layar Stack dan parameternya
export type RootStackParamList = {
  HomeMain: undefined;
  FavoritesMain: undefined;
  RecipeDetail: { recipeId: string };
  SettingsMain: undefined; // <-- INI YANG HILANG
};

// Definisikan layar Tab
export type TabParamList = {
  Home: undefined;
  Favorites: undefined;
  Settings: undefined; // <-- INI YANG HILANG
};

// Ekspor tipe props untuk digunakan di setiap layar
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type RootTabScreenProps<T extends keyof TabParamList> =
  BottomTabScreenProps<TabParamList, T>;