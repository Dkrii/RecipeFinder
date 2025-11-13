import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import { getLanguage, saveLanguage } from '../services/StorageService';

// Impor file terjemahan
import en from '../localization/en.json';
import id from '../localization/id.json';

// --- PERBAIKAN: Gunakan getLocales() agar lebih aman ---
const locales = Localization.getLocales();
// Ambil kode bahasa dari locale pertama, fallback ke 'en' jika tidak ada
const deviceLang = locales[0]?.languageCode || 'en';
// --- AKHIR PERBAIKAN ---

// Konfigurasi i18n
const i18n = new I18n({
  en,
  id,
});

// Set bahasa default SEKARANG, sebelum render
i18n.locale = deviceLang;

// Aktifkan fallback (jika ada key yg hilang di id.json, pakai en.json)
i18n.enableFallback = true;

// Tipe untuk Context
interface LocalizationContextType {
  t: (scope: string, options?: any) => string;
  setLocale: (locale: string) => void;
  locale: string;
}

// Buat Context
const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

// Buat Provider
export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Gunakan bahasa default yang sudah kita tentukan
  const [locale, setLocaleState] = useState(deviceLang);

  // Muat bahasa yang tersimpan saat app dibuka
  useEffect(() => {
    const loadLocale = async () => {
      const savedLang = await getLanguage();
      // Jika ada bahasa tersimpan, DAN berbeda dari bahasa perangkat,
      // baru kita perbarui state
      if (savedLang && savedLang !== locale) {
        setLocaleState(savedLang);
        i18n.locale = savedLang;
      }
    };
    loadLocale();
  }, []); // Dependensi kosong, hanya jalan sekali

  // Fungsi untuk mengubah bahasa
  const setLocale = (lang: string) => {
    setLocaleState(lang);
    i18n.locale = lang;
    saveLanguage(lang);
  };

  // Fungsi 't' adalah alias untuk i18n.t
  const t = (scope: string, options?: any) => i18n.t(scope, options);

  return (
    <LocalizationContext.Provider value={{ t, setLocale, locale }}>
      {children}
    </LocalizationContext.Provider>
  );
};

// Buat Custom Hook untuk gampang dipakai
export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};