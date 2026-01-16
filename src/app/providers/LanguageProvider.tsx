"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "../i18n/en.json";
import vi from "../i18n/vi.json";

type Lang = "en" | "vi";
type Dict = Record<string, string>;

const DICTS: Record<Lang, Dict> = {
  en: en as Dict,
  vi: vi as Dict,
};

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Load from localStorage on client side only
    const stored =
      typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null;
    if (stored && (stored === "en" || stored === "vi")) {
      setLangState(stored);
      if (typeof document !== "undefined") document.documentElement.lang = stored;
    } else {
      const browser =
        typeof navigator !== "undefined" ? (navigator.language || "en").slice(0, 2) : "en";
      const initial: Lang = browser === "vi" ? "vi" : "en";
      setLangState(initial);
      if (typeof document !== "undefined") document.documentElement.lang = initial;
    }
    setIsHydrated(true);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };

  const dict = useMemo(() => DICTS[lang] ?? DICTS.en, [lang]);

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang,
      t: (key: string) => dict[key] ?? key,
    }),
    [lang, dict]
  );

  // Only render provider after hydration to avoid mismatch
  if (!isHydrated) {
    return (
      <I18nContext.Provider value={{ lang: "en", setLang, t: (key: string) => key }}>
        {children}
      </I18nContext.Provider>
    );
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}
