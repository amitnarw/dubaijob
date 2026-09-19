/**
 * i18n core. Locale persisted in AsyncStorage; default = device language
 * when supported, else English. All user-facing strings route through t().
 */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { EN, STRINGS } from '@/i18n/strings/en';

export type Lang = 'en' | 'hi' | 'si' | 'ta' | 'ur' | 'bn';
export type StringKey = keyof typeof EN;
export type Strings = Record<StringKey, string>;

const STORAGE_KEY = '@dubaijob_locale_v1';

export const LANGUAGES: { code: Lang; nativeName: string; englishName: string }[] = [
  { code: 'en', nativeName: 'English', englishName: 'English' },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi' },
  { code: 'si', nativeName: 'සිංහල', englishName: 'Sinhala' },
  { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil' },
  { code: 'ur', nativeName: 'اردو', englishName: 'Urdu' },
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali' },
];

const LANGUAGES_SET = new Set<string>(['en', 'hi', 'si', 'ta', 'ur', 'bn']);

interface LocaleContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: StringKey, vars?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (k) => EN[k],
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored && LANGUAGES_SET.has(stored)) {
          setLangState(stored as Lang);
        } else {
          setLangState(normalizeDeviceLang());
        }
      })
      .catch(() => setLangState(normalizeDeviceLang()));
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    AsyncStorage.setItem(STORAGE_KEY, l).catch(() => {});
  };

  const t = useMemo(() => {
    return (key: StringKey, vars?: Record<string, string | number>): string => {
      const dict = STRINGS[lang] ?? EN;
      let s: string = dict[key] ?? EN[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        }
      }
      return s;
    };
  }, [lang]);

  return (
    <LocaleContext.Provider value={{ lang, setLang, t }}>{children}</LocaleContext.Provider>
  );
}

function normalizeDeviceLang(): Lang {
  try {
    const locales = Localization.getLocales();
    const code = locales?.[0]?.languageCode ?? 'en';
    return (LANGUAGES_SET.has(code) ? code : 'en') as Lang;
  } catch {
    return 'en';
  }
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}