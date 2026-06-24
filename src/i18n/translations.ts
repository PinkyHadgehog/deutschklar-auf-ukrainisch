export type Lang = "uk" | "de";

export const t = {
  nav: {
    home: { uk: "Головна", de: "Startseite" },
    courses: { uk: "Курси", de: "Kurse" },
    grammar: { uk: "Граматика", de: "Grammatik" },
    vocab: { uk: "Словник", de: "Wortschatz" },
    test: { uk: "Тест", de: "Einstufungstest" },
    pricing: { uk: "Тарифи", de: "Preise" },
    dashboard: { uk: "Кабінет", de: "Dashboard" },
    progress: { uk: "Прогрес", de: "Fortschritt" },
    profile: { uk: "Профіль", de: "Profil" },
    admin: { uk: "Адмін", de: "Admin" },
    login: { uk: "Увійти", de: "Anmelden" },
    signup: { uk: "Реєстрація", de: "Registrieren" },
    logout: { uk: "Вийти", de: "Abmelden" },
  },
  common: {
    free: { uk: "Безкоштовно", de: "Kostenlos" },
    premium: { uk: "Преміум", de: "Premium" },
    locked: { uk: "Закрито", de: "Gesperrt" },
    continue: { uk: "Продовжити", de: "Weiter" },
    start: { uk: "Почати", de: "Starten" },
    next: { uk: "Далі", de: "Weiter" },
    prev: { uk: "Назад", de: "Zurück" },
    save: { uk: "Зберегти", de: "Speichern" },
    cancel: { uk: "Скасувати", de: "Abbrechen" },
    lessons: { uk: "лекцій", de: "Lektionen" },
    level: { uk: "Рівень", de: "Niveau" },
    progress: { uk: "Прогрес", de: "Fortschritt" },
  },
};

export const tt = (path: string, lang: Lang): string => {
  const parts = path.split(".");
  let cur: any = t;
  for (const p of parts) cur = cur?.[p];
  if (cur && typeof cur === "object" && lang in cur) return cur[lang];
  return path;
};
