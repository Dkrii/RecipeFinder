// Definisikan kamus kata kunci Indonesia -> Inggris
const dictionary: { [key: string]: string } = {
  // KATA KUNCI UTAMA
  "nasi": "rice",
  "ayam": "chicken",
  "daging": "beef",
  "sapi": "beef",
  "babi": "pork",
  "ikan": "fish",
  "udang": "prawn",
  "cumi": "squid",
  "telur": "egg",
  "tahu": "tofu",
  "tempe": "tempeh",
  "kentang": "potato",
  "wortel": "carrot",
  "bawang": "onion",
  "bawang putih": "garlic",
  "bawang merah": "shallot",
  "cabai": "chili",
  "tomat": "tomato",
  "susu": "milk",
  "keju": "cheese",
  "mie": "noodles",
  "roti": "bread",
  "pasta": "pasta",
  "jamur": "mushroom",
  "brokoli": "broccoli",
};

/**
 * Menerjemahkan query pencarian dari Bahasa Indonesia ke Bahasa Inggris
 * jika ada di dalam kamus. Jika tidak, kembalikan kata aslinya.
 */
export const translateQuery = (query: string): string => {
  const cleanQuery = query.toLowerCase().trim();
  const translation = dictionary[cleanQuery];

  if (translation) {
    console.log(`TranslateService: Menerjemahkan "${query}" -> "${translation}"`);
    return translation;
  }

  console.log(`TranslateService: Tidak ada terjemahan untuk "${query}", menggunakan kata asli.`);
  return cleanQuery;
};