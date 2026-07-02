// Розширення для уроків: додаткові поля (цілі, правило, пам'ятка, поради, порівняння, підсумок)
// + повністю нові уроки (наприклад konjunktiv1) + 15-вправ-набори для еталонних лекцій.
//
// Усе опційне — старі уроки залишаються без змін. Lesson.tsx підмішує ці дані за slug.

import type { LessonContent } from "./lessons";
import type { ExerciseItem } from "./exerciseSets";
import { a1ExtraLessons, a1Extras, a1Exercises15 } from "./a1";
import { a2ExtraLessons, a2Extras, a2Exercises15 } from "./a2";
import { b1ExtraLessons, b1Extras, b1Exercises15 } from "./b1";
import { b2ExtraLessons, b2Extras, b2Exercises15 } from "./b2";
import { c1ExtraLessons, c1Extras, c1Exercises15 } from "./c1";

export interface RuleBoxData {
  title?: string;
  rule: string; // HTML allowed
  examples?: { de: string; uk: string }[];
}

export interface LanguageComparisonData {
  commons?: string[];
  diffs?: string[];
  traps?: string[];
}

export interface LessonExtras {
  duration?: number; // хв
  premium?: boolean;
  learningGoals?: string[];
  ruleBox?: RuleBoxData;
  ukrainianTips?: string[];
  languageComparison?: LanguageComparisonData;
  summary?: string[];
  exercises15?: ExerciseItem[]; // якщо задано — замінює exerciseSets[slug] як основний 15-набір
}

// ============== EXTRAS ==============
const lessonExtrasBase: Record<string, LessonExtras> = {
  praesens: {
    duration: 15,
    premium: false,
    learningGoals: [
      "правильно утворювати Präsens усіх правильних дієслів",
      "знати чергування голосної у сильних дієслів (a→ä, e→i/ie)",
      "відмінювати sein і haben у Präsens",
      "розповідати про себе, свій день і звички",
    ],
    ruleBox: {
      rule: "Präsens = <b>основа дієслова + особове закінчення</b> (-e, -st, -t, -en, -t, -en). Дієслово стоїть на <b>2 місці</b>.",
      examples: [
        { de: "Ich lerne Deutsch.", uk: "Я вчу німецьку." },
        { de: "Du sprichst gut.", uk: "Ти добре розмовляєш." },
      ],
    },
    ukrainianTips: [
      "В українській «я працюю» / «ти працюєш» — одна форма, у німецькій <b>обовʼязково</b> змінюється закінчення.",
      "В українській субʼєкт часто опускають («Працюю»), у німецькій займенник <b>обовʼязковий</b>: <i>Ich arbeite.</i>",
      "У німецькій Präsens покриває й майбутнє: <i>Morgen fahre ich nach Wien</i> = «Завтра я їду до Відня».",
    ],
    languageComparison: {
      commons: ["Як і в українській, форма теперішнього часу описує дії зараз і звички."],
      diffs: [
        "Закінчень у німецькій менше (по 4 унікальні форми), але порядок слів значно жорсткіший.",
        "У сильних дієслів змінюється коренева голосна тільки в 2 і 3 особі однини.",
      ],
      traps: [
        "Помилка: перенесення українського «я можу їхати» як «ich kann fahre» замість «ich kann fahren».",
      ],
    },
    summary: [
      "Особові закінчення: <b>-e, -st, -t, -en, -t, -en</b>.",
      "Сильні дієслова змінюють голосну тільки в 2 і 3 ос. однини.",
      "Основа на -t/-d → перед закінченням додаємо <b>-e-</b>: arbeitest, findet.",
      "Дієслово завжди на 2 місці у простому реченні.",
      "Präsens описує теперішнє, звички та часто майбутнє з обставиною часу.",
    ],
  },

  "adjektivdeklination-bestimmter": {
    duration: 20,
    premium: true,
    learningGoals: [
      "розуміти принцип «слабкої» відміни прикметників",
      "правильно ставити -e або -en після der/die/das",
      "відмінювати прикметники у всіх 4 відмінках і множині",
      "уникати типових помилок у Genitiv і Plural",
    ],
    ruleBox: {
      rule: "Після <b>означеного артикля</b> прикметник має лише дві форми: <b>-e</b> або <b>-en</b>. <b>-e</b> — тільки в Nom. однини й Akk. ж./с. роду. У всіх інших випадках — <b>-en</b>.",
      examples: [
        { de: "der kleine Hund", uk: "маленький собака (Nom.)" },
        { de: "den kleinen Hund", uk: "маленького собаку (Akk.)" },
      ],
    },
    ukrainianTips: [
      "В українській закінчення прикметників узгоджуються з родом, числом і відмінком, але система зовсім інша — не намагайся перекладати дослівно.",
      "Артикль уже несе всю граматичну інформацію, тому німецькій прикметник <b>не повторює</b> цю інформацію — звідси такі «бідні» закінчення -e/-en.",
      "У Plural <b>завжди</b> -en після die — без винятків.",
      "Genitiv часто забувають: <i>des jungen Mannes</i>, не <i>des jung Mannes</i>.",
    ],
    languageComparison: {
      commons: ["Прикметник перед іменником узгоджується — як і в українській."],
      diffs: [
        "У німецькій система спрощена до двох закінчень, але важливий тип артикля (означений / неозначений / без артикля).",
        "Українські «гарного хлопця» = «den netten Jungen», а не «der netter Junge».",
      ],
      traps: [
        "Помилка: «die kleine Kinder» замість «die kleinen Kinder» — у Plural завжди -en.",
        "Помилка: «das Auto des junge Mannes» замість «des jungen Mannes».",
      ],
    },
    summary: [
      "Після der/die/das прикметник = <b>-e</b> або <b>-en</b>.",
      "<b>-e</b>: Nom. однини всіх родів + Akk. жін./сер. роду.",
      "<b>-en</b>: усе інше (Akk. m, Dat., Gen., Plural).",
      "Plural <b>завжди -en</b>.",
      "Артикль уже показує відмінок — прикметник лише «підлаштовується».",
    ],
  },

  konjunktiv1: {
    duration: 25,
    premium: true,
    learningGoals: [
      "розуміти, навіщо в німецькій існує Konjunktiv I",
      "утворювати форми Konjunktiv I основних дієслів",
      "правильно передавати чужі слова в непрямій мові",
      "вибирати між Konjunktiv I та Konjunktiv II, коли форми збігаються з Indikativ",
    ],
    ruleBox: {
      rule: "<b>Konjunktiv I</b> — форма непрямої мови (indirekte Rede), типова для журналістики та офіційних текстів. Утворюється від основи інфінітива + закінчення <b>-e, -est, -e, -en, -et, -en</b>.",
      examples: [
        { de: "Er sagt, er sei krank.", uk: "Він каже, що (він) хворий." },
        { de: "Sie sagt, sie habe keine Zeit.", uk: "Вона каже, що не має часу." },
      ],
    },
    ukrainianTips: [
      "В українській чужі слова передають через <i>«що»</i> або просто пряму мову. У німецькій є <b>спеціальна форма дієслова</b>, яка сигналізує: це не моя думка.",
      "Якщо форма Konjunktiv I збігається з Indikativ (наприклад, у 1-й особі ich habe = ich habe), переходимо на <b>Konjunktiv II</b>: <i>ich hätte</i>.",
      "Сполучник <b>«dass»</b> можна опустити, але порядок слів тоді — як у простому реченні (дієслово на 2 місці).",
      "Українській «нібито/мовляв» приблизно відповідає сама форма Konjunktiv I — додатково перекладати не потрібно.",
    ],
    languageComparison: {
      commons: ["І в німецькій, і в українській непряма мова потребує згоди часів і займенників."],
      diffs: [
        "Українська не має окремої форми «непрямої мови» — лише змінює займенники й часи.",
        "Німецька Konjunktiv I — це <b>морфологічно інша форма</b>, не просто інтонація.",
      ],
      traps: [
        "Не плутати: «Er sagt, er <b>ist</b> krank» — це не Konjunktiv I, а просто Indikativ (звучить як власна оцінка).",
        "Часи в непрямій мові: минуле → <i>habe/sei + Partizip II</i> незалежно від того, який саме минулий час був у прямій мові.",
      ],
    },
    summary: [
      "Konjunktiv I = форма для непрямої мови.",
      "Основа інфінітива + -e/-est/-e/-en/-et/-en.",
      "Найважливіші форми: <b>er sei, er habe, er werde</b> + Partizip II / Infinitiv.",
      "Якщо форма = Indikativ → беремо Konjunktiv II (hätte, wäre, würde).",
      "Минулий час у непрямій мові: <b>habe/sei + Partizip II</b>.",
      "Майбутнє: <b>werde + Infinitiv</b>.",
    ],
  },
};

// ============== ДОДАТКОВІ ПОВНІ УРОКИ (slug-и, яких ще немає в lessons.ts) ==============
const extraLessonsBase: Record<string, LessonContent> = {
  konjunktiv1: {
    slug: "konjunktiv1",
    level: "C1",
    category: "Дієслова",
    titleDe: "Konjunktiv I",
    titleUk: "Конʼюнктив I — непряма мова",
    goal: "Передавати чужі висловлювання у формі непрямої мови, типовій для новин, наукових і офіційних текстів.",
    explanation: [
      "<b>Konjunktiv I</b> — окрема форма дієслова, яку німецька використовує, щоб дистанціюватися від чужої думки: автор лише <i>передає</i>, що було сказано, не оцінюючи правдивість.",
      "Утворюється від <b>основи інфінітива</b> + закінчення <b>-e, -est, -e, -en, -et, -en</b>. Найважливіші форми — для 3 особи однини й множини, бо саме там Konjunktiv I зазвичай відрізняється від Indikativ.",
      "Дієслово <b>sein</b> має особливі форми: <b>ich sei, du sei(e)st, er sei, wir seien, ihr seiet, sie seien</b>. Це найчастіше вживана форма Konjunktiv I.",
      "Коли форма Konjunktiv I <b>збігається з Indikativ</b> (типово в 1 і 3 особі множини, а часто й у 1 особі однини), потрібно перейти на <b>Konjunktiv II</b>: <i>sie haben → sie hätten</i>, <i>wir kommen → wir kämen</i> або з <i>würden</i>.",
      "У непрямій мові <b>часи спрощуються до трьох</b>: теперішнє → Konjunktiv I Präsens; будь-яке минуле (Perfekt/Präteritum/Plusquamperfekt) → Konjunktiv I Perfekt (<i>habe/sei + P II</i>); майбутнє → <i>werde + Infinitiv</i>.",
    ],
    table: {
      headers: ["", "sein", "haben", "werden", "gehen", "können"],
      rows: [
        ["ich", "sei", "habe", "werde", "gehe", "könne"],
        ["du", "sei(e)st", "habest", "werdest", "gehest", "könnest"],
        ["er/sie/es", "sei", "habe", "werde", "gehe", "könne"],
        ["wir", "seien", "haben*", "werden*", "gehen*", "können*"],
        ["ihr", "seiet", "habet", "werdet", "gehet", "könnet"],
        ["sie/Sie", "seien", "haben*", "werden*", "gehen*", "können*"],
      ],
    },
    examples: [
      { de: "Der Minister erklärte, die Lage sei stabil.", uk: "Міністр заявив, що ситуація стабільна.", tag: "Konjunktiv I, Präsens" },
      { de: "Sie sagt, sie habe gestern lange gearbeitet.", uk: "Вона каже, що вчора довго працювала.", tag: "Konjunktiv I, Perfekt" },
      { de: "Er behauptet, er werde pünktlich kommen.", uk: "Він стверджує, що прийде вчасно.", tag: "Futur (Konjunktiv I)" },
      { de: "Die Studierenden sagten, sie hätten die Aufgabe verstanden.", uk: "Студенти сказали, що зрозуміли завдання.", tag: "форма збігається — K.II" },
      { de: "Der Zeuge erklärte, er sei zum Tatzeitpunkt zu Hause gewesen.", uk: "Свідок пояснив, що під час події був удома.", tag: "офіційний стиль" },
      { de: "In der Studie heißt es, das Ergebnis sei signifikant.", uk: "У дослідженні зазначається, що результат значущий." },
      { de: "Anna sagte, sie könne morgen leider nicht kommen.", uk: "Анна сказала, що, на жаль, не зможе прийти завтра." },
      { de: "Die Zeitung berichtet, der Präsident werde nach Berlin reisen.", uk: "Газета повідомляє, що президент поїде до Берліна." },
    ],
    tip: "Якщо Konjunktiv I <b>не відрізняється</b> від Indikativ — переходимо на Konjunktiv II: <i>sie haben</i> → <i>sie hätten</i>, <i>wir kommen</i> → <i>wir kämen</i> або <i>würden kommen</i>.",
    mistakes: [
      { wrong: "Er sagt, er ist krank.", right: "Er sagt, er sei krank." },
      { wrong: "Sie sagte, sie hat keine Zeit gehabt.", right: "Sie sagte, sie habe keine Zeit gehabt." },
      { wrong: "Sie sagten, sie haben das verstanden.", right: "Sie sagten, sie hätten das verstanden." },
    ],
    exercises: {
      mc: {
        q: "Er sagt, er ___ krank.",
        options: ["ist", "sei", "wäre", "war"],
        correct: 1,
        explain: "Konjunktiv I від sein → sei.",
      },
      gap: {
        q: "Sie behauptet, sie ___ keine Zeit. (haben — K.I, 3 Sg.)",
        answer: "habe",
      },
    },
    prevSlug: "konjunktiv2",
  },
};

// ============== 15-ВПРАВ-НАБОРИ для еталонних лекцій ==============
// Якщо для уроку є запис у lessonExercises15 — Lesson.tsx показує саме його.
const lessonExercises15Base: Record<string, ExerciseItem[]> = {
  konjunktiv1: [
    { type: "mc", q: "Er sagt, er ___ krank.", options: ["ist","sei","wäre","war"], correct: 1, explain: "Konjunktiv I від sein → sei." },
    { type: "mc", q: "Sie behauptet, sie ___ keine Zeit.", options: ["hat","habe","hätte","haben"], correct: 1, explain: "3 ос. одн.: habe." },
    { type: "gap", q: "Er erklärt, er ___ morgen kommen. (werden — K.I, 3 Sg.)", answer: "werde" },
    { type: "gap", q: "Anna sagt, sie ___ den Film schon gesehen. (haben — K.I, 3 Sg.)", answer: "habe", hint: "K.I Perfekt: habe + P II." },
    { type: "tf", q: "Konjunktiv I дієслова sein у 3 особі однини — «sei».", correct: true },
    { type: "tf", q: "Якщо форма K.I збігається з Indikativ, треба використати K.II.", correct: true, explain: "Інакше речення прозвучить як власна думка автора." },
    { type: "mc", q: "Die Studierenden sagten, sie ___ die Aufgabe verstanden.", options: ["haben","habe","hätten","seien"], correct: 2,
      explain: "3 ос. мн. K.I = K.Indikativ → беремо K.II hätten." },
    { type: "match", prompt: "Зістав пряму мову з непрямою:", pairs: [
      { left: "«Ich bin müde.»", right: "Er sagt, er sei müde." },
      { left: "«Ich habe gearbeitet.»", right: "Er sagt, er habe gearbeitet." },
      { left: "«Wir kommen morgen.»", right: "Sie sagen, sie würden morgen kommen." },
      { left: "«Ich kann nicht.»", right: "Er sagt, er könne nicht." },
    ]},
    { type: "correct", prompt: "Виправ непряму мову:", wrong: "Er sagt, er ist krank.",
      correct: ["Er sagt, er sei krank."], explain: "У непрямій мові — Konjunktiv I." },
    { type: "correct", prompt: "Виправ форму:", wrong: "Sie sagten, sie haben das gewusst.",
      correct: ["Sie sagten, sie hätten das gewusst."], explain: "3 ос. мн. — переходимо на K.II." },
    { type: "multi", q: "Виділи всі форми Konjunktiv I (можна кілька):",
      options: ["er sei", "er ist", "sie habe", "sie hat", "er werde", "wir hätten"], correct: [0,2,4],
      explain: "«wir hätten» — це K.II, не K.I." },
    { type: "order", prompt: "Склади речення непрямої мови:",
      words: ["gesehen", "habe", "den", "Film", "schon", "sie", "sagt,", "Anna"],
      correct: ["Anna","sagt,","sie","habe","den","Film","schon","gesehen"] },
    { type: "translate", prompt: "Передай у непрямій мові (Konjunktiv I):",
      uk: "Міністр сказав, що ситуація стабільна.",
      de: ["Der Minister sagte, die Lage sei stabil.", "Der Minister sagte, dass die Lage stabil sei."] },
    { type: "translate", prompt: "Передай у непрямій мові (минуле):",
      uk: "Він сказав, що багато працював.",
      de: ["Er sagte, er habe viel gearbeitet."], explain: "Будь-яке минуле → habe/sei + P II." },
    { type: "writeFree",
      prompt: "Перетвори на непряму мову (Konjunktiv I), будь-який власний приклад: новинне повідомлення з 2 речень.",
      sample: "Die Sprecherin erklärte, die neuen Regeln träten ab Januar in Kraft. Sie betonte, alle Bürger seien rechtzeitig informiert worden.",
      explain: "Перевір: 3 ос. — sei/habe/werde; якщо форма = Indikativ → K.II." },
  ],
};

// ============== ЗВЕДЕНІ ЕКСПОРТИ (база + A1 + A2 + B1 + B2 + C1 модулі) ==============
// C1 > B2 > B1 > A2 > A1 > база за пріоритетом, якщо slug збігається.
export const lessonExtras: Record<string, LessonExtras> = { ...lessonExtrasBase, ...a1Extras, ...a2Extras, ...b1Extras, ...b2Extras, ...c1Extras };
export const extraLessons: Record<string, LessonContent> = { ...extraLessonsBase, ...a1ExtraLessons, ...a2ExtraLessons, ...b1ExtraLessons, ...b2ExtraLessons, ...c1ExtraLessons };
export const lessonExercises15: Record<string, ExerciseItem[]> = { ...lessonExercises15Base, ...a1Exercises15, ...a2Exercises15, ...b1Exercises15, ...b2Exercises15, ...c1Exercises15 };

