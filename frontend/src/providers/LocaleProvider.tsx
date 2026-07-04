"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import en from "@/i18n/en.json";
import bn from "@/i18n/bn.json";

export type Locale = "en" | "bn";

// Define a type for the translation files.
// This could be extended for more robust type-checking.
type Translations = typeof en;

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const LocaleContext = createContext<LocaleContextType | undefined>(
  undefined
);

const translations: Record<Locale, Translations> = { en, bn };

// Helper to get a nested value from an object based on a string path.
function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function LocaleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("locale");
    if (saved === "en" || saved === "bn") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (locale: Locale) => {
    localStorage.setItem("locale", locale);
    setLocaleState(locale);
    document.documentElement.lang = locale;
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback((key: string) => {
    const translationSet = translations[locale] || translations.en;
    const value = getNestedValue(translationSet, key);
    return value || key;
  }, [locale]);

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        t,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error(
      "useLocale must be used inside LocaleProvider"
    );
  }

  return context;
}