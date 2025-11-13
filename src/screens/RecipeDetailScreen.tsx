import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar, // 1. Import StatusBar
} from 'react-native';
// 2. Import hook untuk mendapatkan jarak aman (Safe Area)
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { useFocusEffect } from '@react-navigation/native';
import { getRecipeDetailsById, MealDetail, MealSummary } from '../services/TheMealDB';
import { saveFavorite, removeFavorite, isFavorite } from '../services/StorageService';
import { RootStackScreenProps } from '../navigation/types';
import { useLocalization } from '../context/LocalizationContext';
import { Ionicons } from '@expo/vector-icons';

// Fungsi parser bahan (tetap sama)
const parseIngredients = (recipe: MealDetail): string[] => {
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push(`${measure || ''} ${ingredient}`.trim());
    }
  }
  return ingredients;
};

type Props = RootStackScreenProps<'RecipeDetail'>;

const RecipeDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { t } = useLocalization();
  const { recipeId } = route.params;
  
  // 3. Dapatkan jarak aman dari atas (notch)
  const insets = useSafeAreaInsets(); 
  
  const [recipe, setRecipe] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFav, setIsFav] = useState<boolean>(false);
  const [ingredients, setIngredients] = useState<string[]>([]);

  // ... (useFocusEffect dan handleToggleFavorite biarkan sama)
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
          const details = await getRecipeDetailsById(recipeId);
          if (details) {
            setRecipe(details);
            setIngredients(parseIngredients(details));
            const favStatus = await isFavorite(recipeId);
            setIsFav(favStatus);
          } else {
            setError(t('recipeDetail.error'));
          }
        } catch (err) {
          setError(t('recipeDetail.error'));
        }
        setLoading(false);
      };
      loadData();
    }, [recipeId, t])
  );

  const handleToggleFavorite = async () => {
    if (!recipe) return;
    const fav = await isFavorite(recipe.idMeal);
    if (fav) {
      await removeFavorite(recipe.idMeal);
      setIsFav(false);
    } else {
      const simpleRecipe: MealSummary = {
        idMeal: recipe.idMeal,
        strMeal: recipe.strMeal,
        strMealThumb: recipe.strMealThumb,
      };
      await saveFavorite(recipe);
      setIsFav(true);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="tomato" style={styles.centered} />;
  }

  if (error || !recipe) {
    return <Text style={[styles.centered, { color: 'red' }]}>{error || t('recipeDetail.error')}</Text>;
  }

  // Render UI Baru
  return (
    // 4. Ganti SafeAreaView menjadi View agar gambar bisa full-bleed
    <View style={styles.container}> 
      {/* 5. Set status bar menjadi 'light-content' (teks putih)
           karena gambar di atasnya gelap */}
      <StatusBar barStyle="light-content" />
      
      {/* 6. Gunakan insets.top untuk mengatur posisi tombol */}
      <TouchableOpacity 
        style={[styles.backButton, { top: insets.top + 10 }]} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.bookmarkButton, { top: insets.top + 10 }]} 
        onPress={handleToggleFavorite}
      >
        <Ionicons 
          name={isFav ? 'heart' : 'heart'} 
          size={24} 
          color={isFav ? 'tomato' : '#333'} 
        />
      </TouchableOpacity>

      <ScrollView>
        <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
        
        <View style={styles.headerContent}>
          <Text style={styles.title}>{recipe.strMeal}</Text>
          <View style={styles.userInfo}>
            <Ionicons name="person-circle-outline" size={40} color="#888" />
            <View style={styles.userInfoText}>
              <Text style={styles.userName}>Recipe API</Text>
              <Text style={styles.userLocation}>{recipe.strArea || 'International'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={styles.subtitle}>{t('recipeDetail.ingredients')}</Text>
          {ingredients.map((item, index) => (
            <Text key={index} style={styles.text}>• {item}</Text>
          ))}
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={styles.subtitle}>{t('recipeDetail.instructions')}</Text>
          <Text style={styles.text}>{recipe.strInstructions}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: '#F8F8F8',
  },
  image: {
    width: '100%',
    height: 300,
  },
  backButton: {
    position: 'absolute',
    // 7. Hapus 'top' dari sini, kita set di atas
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  bookmarkButton: {
    position: 'absolute',
    // 8. Hapus 'top' dari sini
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  headerContent: {
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoText: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userLocation: {
    fontSize: 14,
    color: '#888',
  },
  separator: {
    height: 8,
    backgroundColor: '#F8F8F8',
  },
  section: {
    padding: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 26,
    color: '#555',
    marginBottom: 8,
  },
});

export default RecipeDetailScreen;