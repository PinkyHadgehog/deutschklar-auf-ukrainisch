import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { Lang } from "@/i18n";
import { translate } from "@/i18n";

export type { Lang };

const UI_KEY = "dk_lang";
const EXPLAIN_KEY = "dk_explanation_lang";

type Translator = (path: string, vars?: Record<string, string | number>) => string;

interface Ctx {
  /** Interface language (navigation, buttons, labels…). */
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Language of educational explanations inside lessons. Independent from `lang`. */
  explanationLang: Lang;
  setExplanationLang: (l: Lang) => void;
  t: Translator;
}

const LanguageContext = createContext<Ctx | null>(null);

const read = (key: string, fallback: Lang): Lang => {
  if (typeof window === "undefined") return fallback;
  const v = localStorage.getItem(key);
  return v === "de" || v === "uk" ? v : fallback;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => read(UI_KEY, "uk"));
  const [explanationLang, setExplanationLangState] = useState<Lang>(() => read(EXPLAIN_KEY, "uk"));

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem(UI_KEY, lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(EXPLAIN_KEY, explanationLang);
  }, [explanationLang]);

  const t = useCallback<Translator>((path, vars) => translate(path, lang, vars), [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang: setLangState,
      explanationLang,
      setExplanationLang: setExplanationLangState,
      t,
    }),
    [lang, explanationLang, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLang = () => {
  const c = useContext(LanguageContext);
  if (!c) throw new Error("useLang outside provider");
  return c;
};

/** Convenience hook matching the common i18n API: const { t } = useTranslation(); */
export const useTranslation = () => {
  const { t, lang } = useLang();
  return { t, lang };
};
