import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalization } from '../context/LocalizationContext';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen: React.FC = () => {
  const { t, setLocale, locale } = useLocalization();

  return (
    // 1. SafeAreaView dengan latar belakang hijau
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t('tabs.settings')}</Text>
      </View>
      
      {/* 2. Konten sekarang dibungkus View terpisah */}
      <View style={styles.contentContainer}>
        <Text style={styles.info}>
          {t('settings.currentLanguage', { 
            lang: locale === 'id' ? 'Indonesia' : 'English' 
          })}
        </Text>

        <TouchableOpacity
          style={[
            styles.optionCard,
            locale === 'id' && styles.optionCardActive
          ]}
          onPress={() => setLocale('id')}
          disabled={locale === 'id'}
        >
          <Ionicons
            name={locale === 'id' ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color={locale === 'id' ? '#4CAF50' : '#ccc'}
          />
          <Text 
            style={[
              styles.optionText,
              locale === 'id' && styles.optionTextActive
            ]}
          >
            Bahasa Indonesia
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionCard,
            locale === 'en' && styles.optionCardActive
          ]}
          onPress={() => setLocale('en')}
          disabled={locale === 'en'}
        >
          <Ionicons
            name={locale === 'en' ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color={locale === 'en' ? '#4CAF50' : '#ccc'}
          />
          <Text 
            style={[
              styles.optionText,
              locale === 'en' && styles.optionTextActive
            ]}
          >
            English
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50', // 3. Latar belakang Safe Area HIJAU
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20, // Perbesar jarak header
    backgroundColor: '#4CAF50',
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
    paddingTop: 20, // Beri jarak
  },
  info: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
    paddingHorizontal: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  optionCardActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#F0FFF0',
  },
  optionText: {
    fontSize: 18,
    marginLeft: 15,
    color: '#333',
  },
  optionTextActive: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default SettingsScreen;