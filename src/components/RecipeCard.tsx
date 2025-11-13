import React, { useState } from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View, Dimensions } from 'react-native';
import { MealSummary } from '../services/TheMealDB';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24;

interface RecipeCardProps {
  item: MealSummary;
  onPress: () => void;
  isFavorite: boolean;
  onToggleFavorite: (item: MealSummary) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ item, onPress, isFavorite, onToggleFavorite }) => {
  const handleFavoritePress = () => {
    onToggleFavorite(item);
  };

  // State untuk efek "hover" (press)
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isPressed && styles.cardPressed // Terapkan style saat dipencet
      ]}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}  // Set true saat mulai dipencet
      onPressOut={() => setIsPressed(false)} // Set false saat dilepas
      activeOpacity={0.9} // Kita set opasitasnya agar tidak terlalu pudar
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />
      
      <TouchableOpacity style={styles.bookmarkButton} onPress={handleFavoritePress}>
        <Ionicons 
          name={isFavorite ? 'heart' : 'heart'} 
          size={24} 
          color={isFavorite ? 'tomato' : '#333'} 
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{item.strMeal}</Text>
        <View style={styles.userInfo}>
          <Ionicons name="person-circle-outline" size={20} color="#888" />
          <Text style={styles.userName}>Recipe API</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    transform: [{ scale: 1 }], // Skala default

  },
  cardPressed: {
    // Style "timbul" ini akan diterapkan saat dipencet
    transform: [{ scale: 1.03 }], // Sedikit membesar
    shadowOpacity: 0.2, // Bayangan lebih kuat
    shadowRadius: 8,
    elevation: 6, // Elevation lebih besar untuk Android
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    borderRadius: 15,
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    height: 40,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  userName: {
    fontSize: 12,
    color: '#888',
    marginLeft: 5,
  },
});

export default RecipeCard;