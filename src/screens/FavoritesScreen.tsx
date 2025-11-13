import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import RecipeCard from '../components/RecipeCard';
import { getFavorites, saveFavorite, removeFavorite, isFavorite } from '../services/StorageService';
import { MealSummary } from '../services/TheMealDB';
import { RootStackScreenProps } from '../navigation/types';
import { useLocalization } from '../context/LocalizationContext';

type Props = RootStackScreenProps<'FavoritesMain'>;

const FavoritesScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useLocalization();
  const [favorites, setFavorites] = useState<MealSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // ... (loadFavorites, useFocusEffect, handleToggleFavorite biarkan sama)
  const loadFavorites = useCallback(async () => {
    setLoading(true);
    const favs = await getFavorites();
    setFavorites(favs);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const handleToggleFavorite = async (recipe: MealSummary) => {
    await removeFavorite(recipe.idMeal);
    setFavorites(prevFavorites =>
      prevFavorites.filter(item => item.idMeal !== recipe.idMeal)
    );
  };
  
  if (loading) {
    return <ActivityIndicator size="large" color="#4CAF50" style={styles.centeredView} />;
  }

  return (
    // 1. SafeAreaView dengan latar belakang hijau
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t('tabs.favorites')}</Text>
      </View>
      
      {favorites.length === 0 ? (
        <View style={styles.contentContainer}>
          <Text style={styles.centeredText}>{t('favorites.empty')}</Text>
        </View>
      ) : (
        // 2. FlatList sekarang ada di dalam View konten
        <FlatList
          style={styles.contentContainer}
          data={favorites}
          keyExtractor={(item) => item.idMeal}
          numColumns={2}
          renderItem={({ item }) => (
            <RecipeCard
              item={item}
              onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.idMeal })}
              isFavorite={true}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 80 }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50', // 3. Latar belakang Safe Area HIJAU
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8', // Latar belakang abu-abu
  },
  centeredText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20, // Perbesar jarak header
    backgroundColor: '#4CAF50', // Background header hijau
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF', // Teks putih
  },
  // 4. Style baru untuk konten
  contentContainer: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10, // Beri jarak dari atas
  },
});

export default FavoritesScreen;