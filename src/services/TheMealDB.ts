import axios from 'axios';

// KEMBALI KE API THEMEALDB
const API_URL = 'https://www.themealdb.com/api/json/v1/1';

// Tipe data dari TheMealDB (original)
export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface MealDetail extends MealSummary {
  strInstructions: string;
  [key: string]: string | null; 
}

// Tipe respons
interface ApiSearchResponse {
  meals: MealSummary[] | null;
}

interface ApiDetailResponse {
  meals: MealDetail[] | null;
}

// FUNGSI BARU: Untuk rekomendasi resep Indonesia
export const getInitialRecipes = async (): Promise<MealSummary[]> => {
  try {
    // Endpoint khusus untuk filter area "Indonesian"
    const response = await axios.get<ApiSearchResponse>(`${API_URL}/filter.php?a=Indonesian`);
    return response.data.meals || [];
  } catch (error) {
    console.error('Error fetching initial recipes:', error);
    throw error;
  }
};

// FUNGSI LAMA (KEMBALI): Cari berdasarkan BAHAN
export const searchRecipesByIngredient = async (ingredient: string): Promise<MealSummary[]> => {
  try {
    const response = await axios.get<ApiSearchResponse>(`${API_URL}/filter.php?i=${ingredient}`);
    return response.data.meals || [];
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

// FUNGSI LAMA (KEMBALI): Ambil detail berdasarkan ID
export const getRecipeDetailsById = async (id: string): Promise<MealDetail | null> => {
  try {
    const response = await axios.get<ApiDetailResponse>(`${API_URL}/lookup.php?i=${id}`);
    return response.data.meals ? response.data.meals[0] : null;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};