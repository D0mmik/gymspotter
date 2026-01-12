"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { Locale, translations, getDefaultLocale, saveLocale, TranslationKey } from "@/lib/i18n";

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  isReady: boolean;
};

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("cs");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedLocale = getDefaultLocale();
    setLocaleState(savedLocale);
    setIsReady(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    saveLocale(newLocale);
  };

  const t = (key: TranslationKey): string => {
    return translations[locale][key];
  };

  const contextValue = useMemo(() => ({
    locale,
    setLocale,
    t,
    isReady,
  }), [locale, isReady]);

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    // Return default values if called outside provider
    return {
      locale: "cs" as Locale,
      setLocale: () => {},
      t: (key: TranslationKey) => translations.cs[key],
      isReady: false,
    };
  }
  return context;
}
