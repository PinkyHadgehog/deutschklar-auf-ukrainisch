export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface Course {
  level: Level;
  title: string;
  description: string;
  lessons: number;
  progress: number;
  premium: boolean;
  color: string;
}

export const courses: Course[] = [
  { level: "A1", title: "Початковий A1", description: "Перші кроки: алфавіт, привітання, базові фрази та граматика.", lessons: 48, progress: 100, premium: false, color: "from-emerald-400 to-teal-500" },
  { level: "A2", title: "Базовий A2", description: "Повсякденне спілкування, минулі часи, прийменники та артиклі.", lessons: 56, progress: 64, premium: false, color: "from-sky-400 to-indigo-500" },
  { level: "B1", title: "Середній B1", description: "Розгорнуті розмови, складні речення, Konjunktiv II, Passiv.", lessons: 72, progress: 22, premium: true, color: "from-violet-500 to-fuchsia-500" },
  { level: "B2", title: "Вищий середній B2", description: "Аргументація, абстрактні теми, ділова німецька.", lessons: 64, progress: 0, premium: true, color: "from-amber-400 to-orange-500" },
  { level: "C1", title: "Просунутий C1", description: "Точність формулювань, академічна та професійна мова.", lessons: 58, progress: 0, premium: true, color: "from-rose-400 to-pink-600" },
  { level: "C2", title: "Майстерність C2", description: "Тонкі нюанси, ідіоми, стилістика, література.", lessons: 42, progress: 0, premium: true, color: "from-slate-600 to-zinc-800" },
];

export interface GrammarTopic {
  slug: string;
  title: string;
  titleDe: string;
  level: Level;
  lessons: number;
  progress: number;
  premium: boolean;
  sub?: { slug: string; title: string; titleDe: string }[];
}

export const grammarCategories: { id: string; title: string; titleDe: string; topics: GrammarTopic[] }[] = [
  {
    id: "verben", title: "Дієслова", titleDe: "Verben",
    topics: [
      { slug: "verben", title: "Дієслова — загальний огляд", titleDe: "Verben", level: "A1", lessons: 24, progress: 80, premium: false, sub: [
        { slug: "praesens", title: "Präsens — теперішній час", titleDe: "Präsens" },
        { slug: "perfekt", title: "Perfekt — доконаний минулий", titleDe: "Perfekt" },
        { slug: "praeteritum", title: "Präteritum — простий минулий", titleDe: "Präteritum" },
        { slug: "futur1", title: "Futur I — майбутній час", titleDe: "Futur I" },
        { slug: "modalverben", title: "Modalverben — модальні дієслова", titleDe: "Modalverben" },
        { slug: "trennbare", title: "Trennbare Verben — відокремлювані", titleDe: "Trennbare Verben" },
        { slug: "untrennbare", title: "Untrennbare Verben — невідокремлювані", titleDe: "Untrennbare Verben" },
        { slug: "reflexive", title: "Reflexive Verben — зворотні", titleDe: "Reflexive Verben" },
        { slug: "verben-praep", title: "Verben mit Präpositionen", titleDe: "Verben mit Präpositionen" },
        { slug: "konjunktiv2", title: "Konjunktiv II — умовний спосіб", titleDe: "Konjunktiv II" },
        { slug: "passiv", title: "Passiv — пасивний стан", titleDe: "Passiv" },
      ]},
    ],
  },
  { id: "substantive", title: "Іменники", titleDe: "Substantive", topics: [
    { slug: "substantive", title: "Іменники: рід, число", titleDe: "Substantive", level: "A1", lessons: 14, progress: 55, premium: false },
  ]},
  { id: "artikel", title: "Артиклі", titleDe: "Artikel", topics: [
    { slug: "artikel", title: "Означений та неозначений артикль", titleDe: "Bestimmter & unbestimmter Artikel", level: "A1", lessons: 10, progress: 70, premium: false },
  ]},
  { id: "pronomen", title: "Займенники", titleDe: "Pronomen", topics: [
    { slug: "pronomen", title: "Особові, присвійні, зворотні займенники", titleDe: "Pronomen", level: "A1", lessons: 12, progress: 40, premium: false },
  ]},
  { id: "adjektive", title: "Прикметники", titleDe: "Adjektive", topics: [
    { slug: "adjektive", title: "Прикметники — загальний огляд", titleDe: "Adjektive", level: "A2", lessons: 18, progress: 30, premium: false, sub: [
      { slug: "adjektivdeklination-bestimmter", title: "Adjektivdeklination — після означеного артикля", titleDe: "Adjektivdeklination" },
      { slug: "komparativ-superlativ", title: "Komparativ und Superlativ", titleDe: "Komparativ & Superlativ" },
      { slug: "adjektive-praep", title: "Adjektive mit Präpositionen", titleDe: "Adjektive mit Präpositionen" },
      { slug: "partizipien", title: "Partizipien als Adjektive", titleDe: "Partizipien als Adjektive" },
    ]},
  ]},
  { id: "adverbien", title: "Прислівники", titleDe: "Adverbien", topics: [
    { slug: "adverbien", title: "Прислівники місця, часу, способу", titleDe: "Adverbien", level: "A2", lessons: 8, progress: 12, premium: false },
  ]},
  { id: "praepositionen", title: "Прийменники", titleDe: "Präpositionen", topics: [
    { slug: "praepositionen", title: "Прийменники з Akk., Dat., Gen.", titleDe: "Präpositionen", level: "A2", lessons: 16, progress: 50, premium: false },
  ]},
  { id: "konjunktionen", title: "Сполучники", titleDe: "Konjunktionen", topics: [
    { slug: "konjunktionen", title: "Сурядні та підрядні сполучники", titleDe: "Konjunktionen", level: "B1", lessons: 10, progress: 0, premium: true },
  ]},
  { id: "satzbau", title: "Будова речення", titleDe: "Satzbau", topics: [
    { slug: "satzbau", title: "Прямий, зворотний порядок, підрядне речення", titleDe: "Satzbau", level: "A2", lessons: 12, progress: 33, premium: false },
  ]},
  { id: "zeiten", title: "Часи", titleDe: "Zeiten", topics: [
    { slug: "zeiten", title: "Огляд усіх часів", titleDe: "Zeiten", level: "B1", lessons: 8, progress: 0, premium: true },
  ]},
  { id: "faelle", title: "Відмінки", titleDe: "Fälle", topics: [
    { slug: "nominativ", title: "Nominativ", titleDe: "Nominativ", level: "A1", lessons: 4, progress: 100, premium: false },
    { slug: "akkusativ", title: "Akkusativ", titleDe: "Akkusativ", level: "A1", lessons: 6, progress: 80, premium: false },
    { slug: "dativ", title: "Dativ", titleDe: "Dativ", level: "A2", lessons: 8, progress: 45, premium: false },
    { slug: "genitiv", title: "Genitiv", titleDe: "Genitiv", level: "B1", lessons: 6, progress: 0, premium: true },
  ]},
  { id: "wortbildung", title: "Словотвір", titleDe: "Wortbildung", topics: [
    { slug: "wortbildung", title: "Префікси, суфікси, складні слова", titleDe: "Wortbildung", level: "B1", lessons: 9, progress: 0, premium: true },
  ]},
];

export interface VocabTheme { id: string; title: string; titleDe: string; emoji: string; count: number; }
export const vocabThemes: VocabTheme[] = [
  { id: "arbeit", title: "Робота і професія", titleDe: "Arbeit und Beruf", emoji: "💼", count: 124 },
  { id: "wohnen", title: "Житло", titleDe: "Wohnen", emoji: "🏠", count: 86 },
  { id: "reisen", title: "Подорожі", titleDe: "Reisen", emoji: "✈️", count: 92 },
  { id: "gesundheit", title: "Здоров'я", titleDe: "Gesundheit", emoji: "🩺", count: 78 },
  { id: "alltag", title: "Повсякдення", titleDe: "Alltag", emoji: "☕", count: 140 },
  { id: "behoerde", title: "Установи", titleDe: "Behörde", emoji: "🏛️", count: 64 },
  { id: "bewerbung", title: "Працевлаштування", titleDe: "Bewerbung", emoji: "📄", count: 58 },
  { id: "beziehungen", title: "Стосунки", titleDe: "Beziehungen", emoji: "❤️", count: 70 },
  { id: "essen", title: "Їжа", titleDe: "Essen", emoji: "🍞", count: 110 },
];

export interface VocabWord {
  de: string; artikel?: "der" | "die" | "das"; plural?: string; uk: string; sample: string; sampleUk: string; theme: string;
}
export const vocabWords: VocabWord[] = [
  { de: "Arbeit", artikel: "die", plural: "—", uk: "робота", sample: "Ich suche eine neue Arbeit.", sampleUk: "Я шукаю нову роботу.", theme: "arbeit" },
  { de: "Bewerbung", artikel: "die", plural: "Bewerbungen", uk: "заявка на роботу", sample: "Meine Bewerbung ist fertig.", sampleUk: "Моя заявка готова.", theme: "arbeit" },
  { de: "Termin", artikel: "der", plural: "Termine", uk: "запис, призначення", sample: "Ich habe morgen einen Termin beim Arzt.", sampleUk: "Завтра в мене запис до лікаря.", theme: "gesundheit" },
  { de: "Wohnung", artikel: "die", plural: "Wohnungen", uk: "квартира", sample: "Wir mieten eine kleine Wohnung in Berlin.", sampleUk: "Ми орендуємо невелику квартиру в Берліні.", theme: "wohnen" },
  { de: "Anmeldung", artikel: "die", plural: "Anmeldungen", uk: "реєстрація (за місцем проживання)", sample: "Die Anmeldung mache ich im Bürgeramt.", sampleUk: "Реєстрацію роблю в Bürgeramt.", theme: "behoerde" },
  { de: "Lebenslauf", artikel: "der", plural: "Lebensläufe", uk: "резюме", sample: "Schick mir bitte deinen Lebenslauf.", sampleUk: "Надішли мені, будь ласка, твоє резюме.", theme: "bewerbung" },
  { de: "Brot", artikel: "das", plural: "Brote", uk: "хліб", sample: "Ich kaufe frisches Brot.", sampleUk: "Я купую свіжий хліб.", theme: "essen" },
];

export interface QuizQuestion {
  q: string; qUk?: string; options: string[]; correct: number; explain: string;
}
export const placementQuiz: QuizQuestion[] = [
  { q: "Wie ___ du?", options: ["heißt", "heißen", "heiße", "heißst"], correct: 0, explain: "Друга особа однини: du heißt." },
  { q: "Ich ___ aus der Ukraine.", options: ["bin", "ist", "bist", "sind"], correct: 0, explain: "1 особа однини sein → ich bin." },
  { q: "Ich trinke ___ Kaffee.", options: ["der", "den", "ein", "einen"], correct: 3, explain: "Akkusativ, чоловічий рід → einen." },
  { q: "___ Wohnung ist sehr schön.", options: ["Der", "Die", "Das", "Den"], correct: 1, explain: "die Wohnung — жіночий рід, Nominativ." },
  { q: "Gestern ___ ich ins Kino gegangen.", options: ["habe", "bin", "war", "hatte"], correct: 1, explain: "Perfekt з gehen утворюється з sein → ich bin gegangen." },
  { q: "Wenn ich Zeit ___, würde ich reisen.", options: ["habe", "hätte", "hatte", "haben"], correct: 1, explain: "Konjunktiv II: hätte." },
  { q: "Er interessiert sich ___ Musik.", options: ["an", "auf", "für", "über"], correct: 2, explain: "sich interessieren für + Akk." },
  { q: "Das ist der Mann, ___ ich gestern gesehen habe.", options: ["der", "den", "dem", "dessen"], correct: 1, explain: "Akkusativ → den." },
  { q: "Ich gehe ___ Schule.", options: ["in der", "in die", "zur", "nach"], correct: 1, explain: "Напрямок (Wohin?) → Akkusativ: in die Schule." },
  { q: "Trotz ___ Regens gehen wir spazieren.", options: ["der", "den", "des", "dem"], correct: 2, explain: "trotz + Genitiv → des Regens." },
];

export interface Testimonial { name: string; level: Level; text: string; }
export const testimonials: Testimonial[] = [
  { name: "Олена, Мюнхен", level: "B1", text: "За пів року з А1 дійшла до B1. Пояснення українською — це справжній порятунок!" },
  { name: "Марʼяна, Гамбург", level: "A2", text: "Нарешті розумію артиклі та відмінки. Уроки короткі, але дуже логічні." },
  { name: "Андрій, Берлін", level: "B2", text: "Готувався до Bewerbung — і отримав роботу. Дякую Оксі за зрозумілий курс!" },
];

export interface Plan {
  id: "free" | "plus" | "premium";
  name: string;
  priceM: number;
  priceY: number;
  features: string[];
  highlight?: boolean;
}
export const plans: Plan[] = [
  { id: "free", name: "Безкоштовно", priceM: 0, priceY: 0, features: [
    "Базові лекції A1", "Тест на визначення рівня", "Декілька вправ", "Доступ до словника",
  ]},
  { id: "plus", name: "Klar Plus", priceM: 12.90, priceY: 119, highlight: true, features: [
    "Усі матеріали A1–B2", "Усі вправи та квізи", "Тренажер словника", "Збереження прогресу", "Без реклами",
  ]},
  { id: "premium", name: "Klar Premium", priceM: 19.90, priceY: 179, features: [
    "Усі матеріали A1–C2", "Ексклюзивні відеоуроки", "PDF-завантаження", "Персональні рекомендації", "Сертифікати про завершення",
  ]},
];
