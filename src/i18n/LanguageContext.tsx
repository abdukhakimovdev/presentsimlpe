import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Lang, LocalizedText, Translations } from './types';
import { uz } from './uz';
import { ru } from './ru';
import { en } from './en';
import { getStorageItem, setStorageItem } from '../utils/storage';

const LANG_STORAGE_KEY = 'ps_academy_lang';

const TRANSLATIONS: Record<Lang, Translations> = {
  uz,
  ru,
  en,
};

interface LanguageContextValue {
  lang: Lang;
  setLang: (next: Lang) => void;
  t: Translations;
  pick: (text: LocalizedText) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = getStorageItem<string>(LANG_STORAGE_KEY, 'uz');
    if (saved === 'uz' || saved === 'ru' || saved === 'en') {
      return saved;
    }
    return 'uz';
  });

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    setStorageItem(LANG_STORAGE_KEY, next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const pick = useCallback(
    (text: LocalizedText) => text[lang] ?? text.en,
    [lang]
  );

  const value: LanguageContextValue = {
    lang,
    setLang,
    t: TRANSLATIONS[lang],
    pick,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLang must be used within a LanguageProvider');
  }
  return ctx;
}
