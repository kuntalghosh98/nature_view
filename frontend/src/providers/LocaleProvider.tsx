"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type Locale = "en" | "bn";

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextType | undefined>(
  undefined
);

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

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
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