import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StatusBar, // 1. Import StatusBar
} from 'react-native';
// 2. Import SafeAreaView dari 'react-native-safe-area-context'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import { searchRecipesByIngredient, MealSummary, getInitialRecipes } from '../services/TheMealDB';
import { RootStackScreenProps } from '../navigation/types';
import { useLocalization } from '../context/LocalizationContext';
import { translateQuery } from '../services/TranslationService';
import { getFavorites, saveFavorite, removeFavorite, isFavorite } from '../services/StorageService';

// Data hardcoded untuk "Bahan Populer"
const popularIngredients = [
  { key: 'ayam', name: 'Ayam' }, { key: 'daging', name: 'Daging' },
  { key: 'nasi', name: 'Nasi' }, { key: 'ikan', name: 'Ikan' },
  { key: 'telur', name: 'Telur' }, { key: 'tahu', name: 'Tahu' },
];

type Props = RootStackScreenProps<'HomeMain'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useLocalization();
  const [query, setQuery] = useState<string>('');
  const [recipes, setRecipes] = useState<MealSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // ... (Semua fungsi logika Anda: loadFavorites, useFocusEffect, loadInitialRecipes, handleSearch, useEffect, etc. biarkan sama)
  const loadFavorites = useCallback(async () => {
    const favs = await getFavorites();
    setFavorites(favs.map(f => f.idMeal));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const loadInitialRecipes = async () => {
    setLoading(true);
    setError(null);
    setRecipes([]);
    try {
      const results = await getInitialRecipes();
      setRecipes(results);
    } catch (err) {
      setError(t('home.error'));
    }
    setLoading(false);
  };

  const handleSearch = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    setRecipes([]);
    const translatedQuery = translateQuery(searchQuery);
    try {
      const results = await searchRecipesByIngredient(translatedQuery);
      setRecipes(results);
      if (results.length === 0) {
        setError(t('home.empty', { query: searchQuery }));
      }
    } catch (err) {
      setError(t('home.error'));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadInitialRecipes();
  }, []);

  const onPopularIngredientPress = (ingredient: string) => {
    setQuery(ingredient);
    handleSearch(ingredient);
  };

  const handleToggleFavorite = async (recipe: MealSummary) => {
    const fav = await isFavorite(recipe.idMeal);
    if (fav) {
      await removeFavorite(recipe.idMeal);
    } else {
      await saveFavorite(recipe);
    }
    loadFavorites();
  };

  const renderPopularIngredient = ({ item }: { item: { key: string, name: string } }) => (
    <TouchableOpacity 
      style={styles.popularCard} 
      onPress={() => onPopularIngredientPress(item.key)}
    >
      <Text style={styles.popularText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderRecipeCard = ({ item }: { item: MealSummary }) => (
    <RecipeCard
      item={item}
      onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.idMeal })}
      isFavorite={favorites.includes(item.idMeal)}
      onToggleFavorite={handleToggleFavorite}
    />
  );

  return (
    // 3. Gunakan SafeAreaView dengan latar belakang hijau
    <SafeAreaView style={styles.container}>
      {/* 4. Set status bar (jam, sinyal) menjadi terang (putih) */}
      <StatusBar barStyle="light-content" />
      
      {/* 5. Header sekarang di dalam SafeAreaView */}
      <Text style={styles.headerTitle}>{t('home.findRecipe', { defaultValue: 'Cari Resep' })}</Text>
      <SearchBar 
        value={query} 
        onChangeText={setQuery} 
        onSearch={() => handleSearch(query)} 
      />
      
      {/* 6. ScrollView sekarang memiliki latar belakang abu-abu dan sudut atas */}
      <ScrollView 
        style={styles.contentScrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Bahan Populer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.popularIngredients', { defaultValue: 'Bahan Populer' })}</Text>
          <FlatList
            data={popularIngredients}
            renderItem={renderPopularIngredient}
            keyExtractor={(item) => item.key}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingVertical: 10 }}
          />
        </View>

        {/* Rekomendasi / Hasil Pencarian */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {query ? t('home.searchResults', { defaultValue: 'Hasil Pencarian' }) : t('home.recommendations', { defaultValue: 'Rekomendasi Resep' })}
          </Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="tomato" style={{ marginTop: 20 }} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <FlatList
              data={recipes}
              renderItem={renderRecipeCard}
              keyExtractor={(item) => item.idMeal}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={{ alignItems: 'center', paddingBottom: 80 }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50', // 7. Latar belakang Safe Area (notch) HIJAU
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF', // Teks putih
    paddingHorizontal: 16,
    paddingTop: 0, // Padding atas tidak perlu, sudah ditangani Safe Area
    paddingBottom: 10,
  },
  // 8. Style baru untuk ScrollView
  contentScrollView: {
    flex: 1,
    backgroundColor: '#F8F8F8', // Latar belakang konten abu-abu
    borderTopLeftRadius: 30, // Sudut bulat di atas
    borderTopRightRadius: 30,
    paddingTop: 10, // Beri jarak sedikit dari header
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 5,
  },
  popularCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EEE'
  },
  popularText: {
    fontSize: 14,
    color: '#555',
  },
  errorText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
    marginTop: 20,
    paddingHorizontal: 16,
  }
});

export default HomeScreen;