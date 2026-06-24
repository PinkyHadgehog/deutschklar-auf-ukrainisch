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
      { slug: "verben-a1", title: "A1 — Основи дієслів", titleDe: "Verben A1 — Grundlagen", level: "A1", lessons: 8, progress: 60, premium: false, sub: [
        { slug: "praesens", title: "Präsens — теперішній час", titleDe: "Präsens" },
        { slug: "regelmaessige-verben", title: "Regelmäßige Verben — правильні дієслова", titleDe: "Regelmäßige Verben" },
        { slug: "unregelmaessige-verben", title: "Unregelmäßige Verben — неправильні дієслова", titleDe: "Unregelmäßige Verben" },
        { slug: "sein-haben", title: "sein und haben — дієслова sein та haben", titleDe: "sein und haben" },
        { slug: "modalverben", title: "Modalverben — модальні дієслова", titleDe: "Modalverben" },
        { slug: "trennbare", title: "Trennbare Verben — відокремлювані дієслова", titleDe: "Trennbare Verben" },
        { slug: "reflexive-basis", title: "Reflexive Verben: Grundlagen — основи зворотних дієслів", titleDe: "Reflexive Verben: Grundlagen" },
        { slug: "imperativ-basis", title: "Imperativ: Grundlagen — основи наказового способу", titleDe: "Imperativ: Grundlagen" },
      ]},
      { slug: "verben-a2", title: "A2 — Дієслова у повсякденні", titleDe: "Verben A2 — im Alltag", level: "A2", lessons: 11, progress: 25, premium: false, sub: [
        { slug: "perfekt", title: "Perfekt — минулий розмовний час", titleDe: "Perfekt" },
        { slug: "praeteritum-sein-haben", title: "Präteritum von sein und haben — Präteritum дієслів sein та haben", titleDe: "Präteritum von sein und haben" },
        { slug: "praeteritum-modalverben", title: "Präteritum der Modalverben — Präteritum модальних дієслів", titleDe: "Präteritum der Modalverben" },
        { slug: "reflexive", title: "Reflexive Verben — зворотні дієслова", titleDe: "Reflexive Verben" },
        { slug: "verben-akkusativ", title: "Verben mit Akkusativ — дієслова зі знахідним відмінком", titleDe: "Verben mit Akkusativ" },
        { slug: "verben-dativ", title: "Verben mit Dativ — дієслова з давальним відмінком", titleDe: "Verben mit Dativ" },
        { slug: "verben-akk-dat", title: "Verben mit Akkusativ und Dativ — дієслова зі знахідним і давальним", titleDe: "Verben mit Akkusativ und Dativ" },
        { slug: "verben-praep-basis", title: "Verben mit Präpositionen: Grundlagen — основи дієслів із прийменниками", titleDe: "Verben mit Präpositionen: Grundlagen" },
        { slug: "futur-praesens", title: "Futur mit Präsens — вираження майбутнього за допомогою Präsens", titleDe: "Futur mit Präsens" },
        { slug: "futur1-basis", title: "Futur I: Grundlagen — основи Futur I", titleDe: "Futur I: Grundlagen" },
        { slug: "imperativ", title: "Imperativ — наказовий спосіб", titleDe: "Imperativ" },
      ]},
      { slug: "verben-b1", title: "B1 — Складніші дієслівні конструкції", titleDe: "Verben B1 — komplexere Strukturen", level: "B1", lessons: 13, progress: 0, premium: true, sub: [
        { slug: "praeteritum", title: "Präteritum häufiger Verben — Präteritum поширених дієслів", titleDe: "Präteritum häufiger Verben" },
        { slug: "futur1", title: "Futur I — майбутній час", titleDe: "Futur I" },
        { slug: "verben-praep", title: "Verben mit Präpositionen — дієслова з прийменниками", titleDe: "Verben mit Präpositionen" },
        { slug: "konjunktiv2-wuensche", title: "Konjunktiv II: Wünsche und Höflichkeit — умовний для бажань і ввічливості", titleDe: "Konjunktiv II: Wünsche und Höflichkeit" },
        { slug: "konjunktiv2-irreal", title: "Konjunktiv II: irreale Situationen — умовний для нереальних ситуацій", titleDe: "Konjunktiv II: irreale Situationen" },
        { slug: "passiv-praesens", title: "Passiv Präsens — пасивний стан у Präsens", titleDe: "Passiv Präsens" },
        { slug: "passiv-praeteritum", title: "Passiv Präteritum — пасивний стан у Präteritum", titleDe: "Passiv Präteritum" },
        { slug: "infinitiv-mit-zu", title: "Infinitiv mit zu — інфінітив із zu", titleDe: "Infinitiv mit zu" },
        { slug: "um-zu", title: "um … zu — конструкція um … zu", titleDe: "um … zu" },
        { slug: "ohne-zu", title: "ohne … zu — конструкція ohne … zu", titleDe: "ohne … zu" },
        { slug: "statt-zu", title: "statt … zu — конструкція statt … zu", titleDe: "statt … zu" },
        { slug: "reflexive-praep", title: "Reflexive Verben mit Präpositionen — зворотні дієслова з прийменниками", titleDe: "Reflexive Verben mit Präpositionen" },
        { slug: "lassen", title: "lassen — вживання дієслова lassen", titleDe: "lassen" },
      ]},
      { slug: "verben-b2", title: "B2 — Просунуті дієслівні конструкції", titleDe: "Verben B2 — fortgeschritten", level: "B2", lessons: 12, progress: 0, premium: true, sub: [
        { slug: "konjunktiv2-vergangenheit", title: "Konjunktiv II der Vergangenheit — умовний спосіб у минулому", titleDe: "Konjunktiv II der Vergangenheit" },
        { slug: "passiv-zeiten", title: "Passiv in verschiedenen Zeitformen — пасив у різних часових формах", titleDe: "Passiv in verschiedenen Zeitformen" },
        { slug: "passiv-modalverben", title: "Passiv mit Modalverben — пасив із модальними дієсловами", titleDe: "Passiv mit Modalverben" },
        { slug: "passiversatz-basis", title: "Passiversatzformen: Grundlagen — основи альтернатив до пасиву", titleDe: "Passiversatzformen: Grundlagen" },
        { slug: "verben-feste-praep", title: "Verben mit festen Präpositionen — дієслова зі сталими прийменниками", titleDe: "Verben mit festen Präpositionen" },
        { slug: "infinitivkonstruktionen", title: "Infinitivkonstruktionen — інфінітивні конструкції", titleDe: "Infinitivkonstruktionen" },
        { slug: "funktionsverbgefuege-basis", title: "Funktionsverbgefüge: Grundlagen — основи сталих дієслівно-іменникових конструкцій", titleDe: "Funktionsverbgefüge: Grundlagen" },
        { slug: "nominalisierung", title: "Nominalisierung von Verben — номіналізація дієслів", titleDe: "Nominalisierung von Verben" },
        { slug: "partizip-adjektive", title: "Partizip I und II als Adjektive — Partizip I та II як прикметники", titleDe: "Partizip I und II als Adjektive" },
        { slug: "bedeutung-aehnlicher-verben", title: "Bedeutungsunterschiede ähnlicher Verben — відмінності між схожими дієсловами", titleDe: "Bedeutungsunterschiede ähnlicher Verben" },
        { slug: "verben-vorsilben", title: "Verben mit mehreren Vorsilben — дієслова з різними префіксами", titleDe: "Verben mit mehreren Vorsilben" },
        { slug: "sich-lassen-infinitiv", title: "sich lassen + Infinitiv — конструкція sich lassen + Infinitiv", titleDe: "sich lassen + Infinitiv" },
      ]},
      { slug: "verben-c1", title: "C1 — Точне та формальне вживання", titleDe: "Verben C1 — präzise & formell", level: "C1", lessons: 15, progress: 0, premium: true, sub: [
        { slug: "konjunktiv1", title: "Konjunktiv I — непряма мова", titleDe: "Konjunktiv I" },
        { slug: "konjunktiv2-komplex", title: "Konjunktiv II in komplexen Aussagen — складні умовні конструкції", titleDe: "Konjunktiv II in komplexen Aussagen" },
        { slug: "passiv-alle-zeiten", title: "Passiv in allen Zeitformen — пасив у всіх часових формах", titleDe: "Passiv in allen Zeitformen" },
        { slug: "passiv-modalverben-c1", title: "Passiv mit Modalverben — пасив із модальними дієсловами", titleDe: "Passiv mit Modalverben" },
        { slug: "passiversatz", title: "Passiversatzformen — альтернативні конструкції до пасиву", titleDe: "Passiversatzformen" },
        { slug: "funktionsverbgefuege", title: "Funktionsverbgefüge — сталі дієслівно-іменникові конструкції", titleDe: "Funktionsverbgefüge" },
        { slug: "verben-feste-praep-c1", title: "Verben mit festen Präpositionen — дієслова зі сталими прийменниками", titleDe: "Verben mit festen Präpositionen" },
        { slug: "komplexe-infinitivkonstruktionen", title: "Komplexe Infinitivkonstruktionen — складні інфінітивні конструкції", titleDe: "Komplexe Infinitivkonstruktionen" },
        { slug: "modalpartizip", title: "Modalpartizip — конструкція zu + Partizip I", titleDe: "Modalpartizip" },
        { slug: "partizip-satzverkuerzung", title: "Partizip I und II als Satzverkürzung — дієприкметникові конструкції", titleDe: "Partizip I und II als Satzverkürzung" },
        { slug: "nominalisierung-c1", title: "Nominalisierung von Verben — номіналізація дієслів", titleDe: "Nominalisierung von Verben" },
        { slug: "verben-indirekte-rede", title: "Verben der indirekten Rede — дієслова непрямої мови", titleDe: "Verben der indirekten Rede" },
        { slug: "bedeutung-aehnlicher-verben-c1", title: "Bedeutungsunterschiede ähnlicher Verben — значеннєві відмінності між схожими дієсловами", titleDe: "Bedeutungsunterschiede ähnlicher Verben" },
        { slug: "verbvalenz", title: "Verbvalenz — валентність дієслова", titleDe: "Verbvalenz" },
        { slug: "verben-wissenschaft", title: "Verben in wissenschaftlichen Texten — дієслова в наукових текстах", titleDe: "Verben in wissenschaftlichen Texten" },
      ]},
      { slug: "verben-c2", title: "C2 — Стиль, нюанси та ідіоматика", titleDe: "Verben C2 — Stil & Nuancen", level: "C2", lessons: 17, progress: 0, premium: true, sub: [
        { slug: "stil-unterschiede", title: "Stilistische Unterschiede zwischen Verben — стилістичні відмінності між дієсловами", titleDe: "Stilistische Unterschiede zwischen Verben" },
        { slug: "verben-formell", title: "Verben in formeller Sprache — дієслова в офіційному стилі", titleDe: "Verben in formeller Sprache" },
        { slug: "verben-wissenschaftlich", title: "Verben in wissenschaftlicher Sprache — дієслова в науковому стилі", titleDe: "Verben in wissenschaftlicher Sprache" },
        { slug: "idiomatische-verben", title: "Idiomatische Verbverbindungen — ідіоматичні дієслівні сполучення", titleDe: "Idiomatische Verbverbindungen" },
        { slug: "komplexe-funktionsverbgefuege", title: "Komplexe Funktionsverbgefüge — складні сталі дієслівно-іменникові конструкції", titleDe: "Komplexe Funktionsverbgefüge" },
        { slug: "bedeutung-praefixverben", title: "Bedeutungsnuancen bei Präfixverben — нюанси значення дієслів із префіксами", titleDe: "Bedeutungsnuancen bei Präfixverben" },
        { slug: "verben-mehrere-bedeutungen", title: "Verben mit mehreren Bedeutungen — багатозначні дієслова", titleDe: "Verben mit mehreren Bedeutungen" },
        { slug: "gehobene-veraltete-verben", title: "Gehobene und veraltete Verbformen — піднесені та застарілі форми", titleDe: "Gehobene und veraltete Verbformen" },
        { slug: "ironisch-bildhaft", title: "Ironische und bildhafte Verwendung — іронічне та образне вживання", titleDe: "Ironische und bildhafte Verwendung" },
        { slug: "elliptische-verbkonstruktionen", title: "Elliptische Verbkonstruktionen — еліптичні дієслівні конструкції", titleDe: "Elliptische Verbkonstruktionen" },
        { slug: "komplexe-indirekte-rede", title: "Komplexe indirekte Rede — складна непряма мова", titleDe: "Komplexe indirekte Rede" },
        { slug: "tempuswechsel", title: "Tempuswechsel als Stilmittel — зміна часових форм як стилістичний засіб", titleDe: "Tempuswechsel als Stilmittel" },
        { slug: "verben-argumentation", title: "Verben für Argumentation und Analyse — дієслова для аргументації та аналізу", titleDe: "Verben für Argumentation und Analyse" },
        { slug: "kollokationen-verben", title: "Kollokationen mit Verben — типові словосполучення з дієсловами", titleDe: "Kollokationen mit Verben" },
        { slug: "regionale-unterschiede", title: "Regionale Unterschiede bei Verben — регіональні відмінності у вживанні", titleDe: "Regionale Unterschiede bei Verben" },
        { slug: "registerwechsel", title: "Registerwechsel — зміна мовного регістру", titleDe: "Registerwechsel" },
        { slug: "bedeutungsfeinheiten-synonyme", title: "Bedeutungsfeinheiten von Synonymen — значеннєві нюанси синонімів", titleDe: "Bedeutungsfeinheiten von Synonymen" },
      ]},
    ],
  },
  { id: "substantive", title: "Іменники", titleDe: "Substantive", topics: [
    { slug: "substantive", title: "A1 — Іменники: рід, число", titleDe: "Substantive A1 — Genus & Numerus", level: "A1", lessons: 14, progress: 35, premium: false, sub: [
      { slug: "genus-substantive", title: "Genus der Substantive — рід іменників", titleDe: "Genus der Substantive" },
      { slug: "mask-fem-neut", title: "Maskulinum, Femininum, Neutrum — чоловічий, жіночий, середній рід", titleDe: "Maskulinum, Femininum und Neutrum" },
      { slug: "artikel-genus", title: "Artikel und Genus — артикль і рід іменника", titleDe: "Artikel und Genus" },
      { slug: "pluralbildung", title: "Pluralbildung — утворення множини", titleDe: "Pluralbildung" },
      { slug: "singular-plural", title: "Singular und Plural — однина і множина", titleDe: "Singular und Plural" },
      { slug: "subst-endung-e", title: "Substantive mit der Endung -e", titleDe: "Substantive mit -e" },
      { slug: "subst-ung-heit-keit", title: "Substantive mit -ung, -heit, -keit", titleDe: "Substantive mit -ung/-heit/-keit" },
      { slug: "subst-chen-lein", title: "Substantive mit -chen und -lein", titleDe: "Substantive mit -chen/-lein" },
      { slug: "zusammengesetzte-subst", title: "Zusammengesetzte Substantive — складні іменники", titleDe: "Zusammengesetzte Substantive" },
      { slug: "grossschreibung", title: "Großschreibung der Substantive — з великої літери", titleDe: "Großschreibung der Substantive" },
      { slug: "personen-berufe", title: "Personen und Berufe — люди і професії", titleDe: "Personen und Berufe" },
      { slug: "laender-nationalitaeten", title: "Länder und Nationalitäten — країни і національності", titleDe: "Länder und Nationalitäten" },
      { slug: "haeufige-pluralformen", title: "Häufige Pluralformen — поширені форми множини", titleDe: "Häufige Pluralformen" },
      { slug: "typische-ausnahmen", title: "Typische Ausnahmen — типові винятки", titleDe: "Typische Ausnahmen" },
    ]},
  ]},
  { id: "artikel", title: "Артиклі", titleDe: "Artikel", topics: [
    { slug: "artikel", title: "A1 — Означений та неозначений артикль", titleDe: "Artikel A1 — bestimmt & unbestimmt", level: "A1", lessons: 10, progress: 25, premium: false, sub: [
      { slug: "bestimmter-artikel", title: "Bestimmter Artikel — означений артикль", titleDe: "Bestimmter Artikel" },
      { slug: "unbestimmter-artikel", title: "Unbestimmter Artikel — неозначений артикль", titleDe: "Unbestimmter Artikel" },
      { slug: "der-die-das", title: "der, die, das", titleDe: "der, die, das" },
      { slug: "ein-eine", title: "ein, eine", titleDe: "ein, eine" },
      { slug: "artikel-singular", title: "Artikel im Singular — артиклі в однині", titleDe: "Artikel im Singular" },
      { slug: "artikel-plural", title: "Artikel im Plural — артиклі в множині", titleDe: "Artikel im Plural" },
      { slug: "negativartikel-kein", title: "Negativartikel kein — заперечний артикль kein", titleDe: "Negativartikel kein" },
      { slug: "artikel-genus-2", title: "Artikel und Genus — артикль і рід", titleDe: "Artikel und Genus" },
      { slug: "artikel-nominativ", title: "Artikel im Nominativ", titleDe: "Artikel im Nominativ" },
      { slug: "artikel-akkusativ", title: "Artikel im Akkusativ", titleDe: "Artikel im Akkusativ" },
    ]},
  ]},
  { id: "pronomen", title: "Займенники", titleDe: "Pronomen", topics: [
    { slug: "pronomen", title: "A1 — Особові, присвійні, зворотні", titleDe: "Pronomen A1", level: "A1", lessons: 12, progress: 20, premium: false, sub: [
      { slug: "personalpron-nom", title: "Personalpronomen im Nominativ — особові у Nominativ", titleDe: "Personalpronomen im Nominativ" },
      { slug: "personalpron-akk", title: "Personalpronomen im Akkusativ — особові у Akkusativ", titleDe: "Personalpronomen im Akkusativ" },
      { slug: "ich-du-er-sie-es", title: "ich, du, er, sie, es", titleDe: "ich, du, er, sie, es" },
      { slug: "wir-ihr-sie-Sie", title: "wir, ihr, sie, Sie", titleDe: "wir, ihr, sie, Sie" },
      { slug: "possessiv-mein-dein", title: "Possessivpronomen: mein und dein", titleDe: "Possessivpronomen: mein/dein" },
      { slug: "possessiv-sein-ihr", title: "Possessivpronomen: sein und ihr", titleDe: "Possessivpronomen: sein/ihr" },
      { slug: "possessiv-unser-euer", title: "Possessivpronomen: unser und euer", titleDe: "Possessivpronomen: unser/euer" },
      { slug: "reflexiv-mich-dich", title: "Reflexivpronomen: mich und dich", titleDe: "Reflexivpronomen: mich/dich" },
      { slug: "reflexiv-sich", title: "Reflexivpronomen: sich", titleDe: "Reflexivpronomen: sich" },
      { slug: "man-pronomen", title: "man — неозначено-особовий займенник", titleDe: "man" },
      { slug: "das-als-pronomen", title: "das als Pronomen", titleDe: "das als Pronomen" },
      { slug: "wer-was-wen", title: "Wer? Was? Wen? — питальні займенники", titleDe: "Wer? Was? Wen?" },
    ]},
  ]},
  { id: "adjektive", title: "Прикметники", titleDe: "Adjektive", topics: [
    { slug: "adjektive", title: "A2 — Прикметники: відмінювання та ступені", titleDe: "Adjektive A2 — Deklination & Steigerung", level: "A2", lessons: 8, progress: 0, premium: false, sub: [
      { slug: "adjektive-praedikativ-attributiv", title: "Prädikativ vs. attributiv — присудкові та означальні прикметники", titleDe: "Prädikativ vs. attributiv" },
      { slug: "adjektivdeklination-bestimmter", title: "Adjektivdeklination — після означеного артикля", titleDe: "Adjektivdeklination (bestimmt)" },
      { slug: "adjektivdeklination-unbestimmter", title: "Adjektivdeklination — після неозначеного артикля", titleDe: "Adjektivdeklination (unbestimmt)" },
      { slug: "adjektivdeklination-nullartikel", title: "Adjektivdeklination — без артикля (Nullartikel)", titleDe: "Adjektivdeklination (Nullartikel)" },
      { slug: "komparativ-superlativ", title: "Komparativ und Superlativ — ступені порівняння", titleDe: "Komparativ & Superlativ" },
      { slug: "komparativ-unregelmaessig", title: "Unregelmäßige Steigerung — нерегулярні ступені (gut, viel, gern, hoch, nah)", titleDe: "Unregelmäßige Steigerung" },
      { slug: "adjektive-als-nomen", title: "Adjektive als Nomen — субстантивовані прикметники", titleDe: "Adjektive als Nomen" },
      { slug: "farben-adjektive", title: "Farben als Adjektive — кольори як прикметники", titleDe: "Farben als Adjektive" },
    ]},
  ]},
  { id: "adverbien", title: "Прислівники", titleDe: "Adverbien", topics: [
    { slug: "adverbien", title: "A2 — Прислівники: місце, час, спосіб, причина", titleDe: "Adverbien A2", level: "A2", lessons: 8, progress: 0, premium: false, sub: [
      { slug: "lokaladverbien", title: "Lokaladverbien — прислівники місця (hier, dort, oben…)", titleDe: "Lokaladverbien" },
      { slug: "temporaladverbien", title: "Temporaladverbien — прислівники часу (heute, bald, immer…)", titleDe: "Temporaladverbien" },
      { slug: "modaladverbien", title: "Modaladverbien — прислівники способу (gern, leider, hoffentlich…)", titleDe: "Modaladverbien" },
      { slug: "kausaladverbien", title: "Kausaladverbien — прислівники причини (deshalb, trotzdem, deswegen…)", titleDe: "Kausaladverbien" },
      { slug: "haeufigkeitsadverbien", title: "Häufigkeitsadverbien — частота (immer, oft, manchmal, selten, nie)", titleDe: "Häufigkeitsadverbien" },
      { slug: "graduierungsadverbien", title: "Gradadverbien — інтенсивність (sehr, ziemlich, ganz, kaum…)", titleDe: "Gradadverbien" },
      { slug: "adverbien-position", title: "Position im Satz — порядок Te-Ka-Mo-Lo", titleDe: "Position im Satz (TeKaMoLo)" },
      { slug: "pronominaladverbien", title: "Pronominaladverbien — darüber, damit, dafür, worauf…", titleDe: "Pronominaladverbien" },
    ]},
  ]},
  { id: "praepositionen", title: "Прийменники", titleDe: "Präpositionen", topics: [
    { slug: "praepositionen", title: "A2 — Präpositionen (огляд)", titleDe: "Präpositionen", level: "A2", lessons: 8, progress: 0, premium: false, sub: [
      { slug: "praep-akkusativ", title: "Präpositionen mit Akkusativ (durch, für, gegen, ohne, um, bis, entlang)", titleDe: "Präpositionen mit Akkusativ" },
      { slug: "praep-dativ", title: "Präpositionen mit Dativ (aus, bei, mit, nach, seit, von, zu…)", titleDe: "Präpositionen mit Dativ" },
      { slug: "wechselpraepositionen", title: "Wechselpräpositionen — Wo? / Wohin?", titleDe: "Wechselpräpositionen" },
      { slug: "praep-genitiv", title: "Präpositionen mit Genitiv (wegen, trotz, während, statt)", titleDe: "Präpositionen mit Genitiv" },
      { slug: "temporale-praepositionen", title: "Temporale Präpositionen — am, im, um, vor, seit, in…", titleDe: "Temporale Präpositionen" },
      { slug: "lokale-praepositionen", title: "Lokale Präpositionen — nach / in / zu / aus / von", titleDe: "Lokale Präpositionen" },
      { slug: "verschmelzungen", title: "Verschmelzungen — am, im, ans, ins, beim, vom, zum, zur", titleDe: "Verschmelzungen" },
      { slug: "praep-feste-wendungen", title: "Feste Wendungen — zu Hause, nach Hause, zu Fuß, auf Deutsch", titleDe: "Feste Wendungen" },
    ]},
  ]},
  { id: "konjunktionen", title: "Сполучники", titleDe: "Konjunktionen", topics: [
    { slug: "konjunktionen", title: "Сурядні та підрядні сполучники", titleDe: "Konjunktionen", level: "B1", lessons: 10, progress: 0, premium: true },
  ]},
  { id: "satzbau", title: "Будова речення", titleDe: "Satzbau", topics: [
    { slug: "satzbau", title: "A2 — Satzbau (огляд)", titleDe: "Satzbau", level: "A2", lessons: 8, progress: 0, premium: false, sub: [
      { slug: "satz-grundregel", title: "Verb auf Position 2 — головне правило порядку слів", titleDe: "Verb auf Position 2" },
      { slug: "satz-fragen", title: "Fragesätze — W-Fragen & Ja/Nein-Fragen", titleDe: "Fragesätze" },
      { slug: "satz-tekamolo", title: "Te-Ka-Mo-Lo — порядок обставин", titleDe: "Te-Ka-Mo-Lo" },
      { slug: "satz-negation", title: "Negation — nicht & kein", titleDe: "Negation" },
      { slug: "satz-konjunktionen", title: "Hauptsatz-Konjunktionen — und, aber, oder, denn, sondern", titleDe: "Hauptsatz-Konjunktionen" },
      { slug: "satz-weil-dass", title: "Nebensatz — weil & dass (дієслово в кінець)", titleDe: "Nebensatz: weil & dass" },
      { slug: "satz-modalverben-position", title: "Satzklammer — Modalverben, Perfekt, відокремлювані префікси", titleDe: "Satzklammer" },
      { slug: "satz-temporale-nebensaetze", title: "Temporale Nebensätze — wenn, als, bevor, nachdem, während", titleDe: "Temporale Nebensätze" },
    ]},
  ]},
  { id: "zeiten", title: "Часи", titleDe: "Zeiten", topics: [
    { slug: "zeiten", title: "Огляд усіх часів", titleDe: "Zeiten", level: "B1", lessons: 8, progress: 0, premium: true },
  ]},
  { id: "faelle", title: "Відмінки", titleDe: "Fälle", topics: [
    { slug: "nominativ", title: "A1 — Nominativ (називний)", titleDe: "Nominativ", level: "A1", lessons: 4, progress: 100, premium: false, sub: [
      { slug: "was-ist-nominativ", title: "Was ist der Nominativ? — що таке Nominativ", titleDe: "Was ist der Nominativ?" },
      { slug: "wer-oder-was", title: "Wer oder was? — питання Nominativ", titleDe: "Wer oder was?" },
      { slug: "artikel-im-nominativ", title: "Artikel im Nominativ — артиклі в Nominativ", titleDe: "Artikel im Nominativ" },
      { slug: "personalpron-im-nominativ", title: "Personalpronomen im Nominativ", titleDe: "Personalpronomen im Nominativ" },
    ]},
    { slug: "akkusativ", title: "A1 — Akkusativ (знахідний)", titleDe: "Akkusativ", level: "A1", lessons: 6, progress: 60, premium: false, sub: [
      { slug: "was-ist-akkusativ", title: "Was ist der Akkusativ? — що таке Akkusativ", titleDe: "Was ist der Akkusativ?" },
      { slug: "wen-oder-was", title: "Wen oder was? — питання Akkusativ", titleDe: "Wen oder was?" },
      { slug: "artikel-im-akkusativ", title: "Artikel im Akkusativ — артиклі в Akkusativ", titleDe: "Artikel im Akkusativ" },
      { slug: "maskulinum-der-den", title: "Maskulinum: der wird den", titleDe: "Maskulinum: der → den" },
      { slug: "personalpron-im-akkusativ", title: "Personalpronomen im Akkusativ", titleDe: "Personalpronomen im Akkusativ" },
      { slug: "verben-mit-akkusativ-a1", title: "Verben mit Akkusativ — дієслова з Akkusativ", titleDe: "Verben mit Akkusativ" },
    ]},
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
