import AsyncStorage from '@react-native-async-storage/async-storage';
import { MealSummary } from './TheMealDB';

const FAVORITES_KEY = '@RecipeFinder:favorites';

export const getFavorites = async (): Promise<MealSummary[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) as MealSummary[] : [];
  } catch (e) {
    console.error('Failed to fetch favorites.', e);
    return [];
  }
};

export const saveFavorite = async (recipe: MealSummary): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    if (!favorites.find(item => item.idMeal === recipe.idMeal)) {
      const newFavorites = [...favorites, recipe];
      const jsonValue = JSON.stringify(newFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, jsonValue);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to save favorite.', e);
    return false;
  }
};

export const removeFavorite = async (recipeId: string): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const newFavorites = favorites.filter(item => item.idMeal !== recipeId);
    const jsonValue = JSON.stringify(newFavorites);
    await AsyncStorage.setItem(FAVORITES_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to remove favorite.', e);
  }
};

export const isFavorite = async (recipeId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return !!favorites.find(item => item.idMeal === recipeId);
  } catch (e) {
    console.error('Failed to check favorite status.', e);
    return false;
  }
};

const LANGUAGE_KEY = '@RecipeFinder:language';

// FUNGSI BARU: Menyimpan bahasa pilihan
export const saveLanguage = async (lang: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  } catch (e) {
    console.error('Failed to save language.', e);
  }
};

// FUNGSI BARU: Mengambil bahasa pilihan
export const getLanguage = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(LANGUAGE_KEY);
  } catch (e) {
    console.error('Failed to fetch language.', e);
    return null;
  }
};