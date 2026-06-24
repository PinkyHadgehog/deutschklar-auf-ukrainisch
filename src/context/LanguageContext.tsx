import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Lang } from "@/i18n/translations";
import { tt } from "@/i18n/translations";

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<Ctx | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "uk";
    return (localStorage.getItem("dk_lang") as Lang) || "uk";
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("dk_lang", lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang: setLangState, t: (p) => tt(p, lang) }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const c = useContext(LanguageContext);
  if (!c) throw new Error("useLang outside provider");
  return c;
};
