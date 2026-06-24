export type LessonLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface LessonExercises {
  mc?: { q: string; options: string[]; correct: number; explain: string };
  gap?: { q: string; answer: string; hint?: string };
  ending?: { q: string; options: string[]; correct: string; hint?: string };
}

export interface LessonContent {
  slug: string;
  level: LessonLevel;
  category: string;
  titleDe: string;
  titleUk: string;
  goal: string;
  explanation: string[]; // paragraphs (HTML allowed: <b>, <span class="hl">)
  table?: { headers: string[]; rows: string[][] };
  examples: { de: string; uk: string; tag?: string }[];
  tip: string;
  mistakes: { wrong: string; right: string }[];
  exercises: LessonExercises;
  prevSlug?: string;
  nextSlug?: string;
}

const L = (l: LessonContent): LessonContent => l;

export const lessons: Record<string, LessonContent> = {
  // ============ VERBEN ============
  verben: L({
    slug: "verben", level: "A1", category: "Дієслова",
    titleDe: "Verben — Überblick", titleUk: "Дієслова — загальний огляд",
    goal: "Зрозуміти, як працюють німецькі дієслова: інфінітив, особові закінчення, сильні/слабкі дієслова.",
    explanation: [
      "Інфінітив німецького дієслова майже завжди закінчується на <b>-en</b>: <b>lernen, machen, gehen</b>. Основа — це частина без -en (lern-, mach-, geh-).",
      "У реченні дієслово змінюється за особою та числом — додає закінчення до основи. У теперішньому часі це: <b>-e, -st, -t, -en, -t, -en</b>.",
      "Розрізняють <b>слабкі</b> (правильні: machen → machte → gemacht) і <b>сильні</b> (з чергуванням: gehen → ging → gegangen) дієслова.",
    ],
    table: {
      headers: ["Pronomen", "lernen", "gehen", "sein", "haben"],
      rows: [
        ["ich", "lerne", "gehe", "bin", "habe"],
        ["du", "lernst", "gehst", "bist", "hast"],
        ["er/sie/es", "lernt", "geht", "ist", "hat"],
        ["wir", "lernen", "gehen", "sind", "haben"],
        ["ihr", "lernt", "geht", "seid", "habt"],
        ["sie/Sie", "lernen", "gehen", "sind", "haben"],
      ],
    },
    examples: [
      { de: "Ich lerne jeden Tag Deutsch.", uk: "Я вчу німецьку щодня.", tag: "Präsens" },
      { de: "Wir gehen am Samstag ins Kino.", uk: "У суботу ми йдемо в кіно." },
      { de: "Er ist Lehrer und hat zwei Kinder.", uk: "Він — учитель і має двох дітей." },
      { de: "Sprichst du Ukrainisch?", uk: "Ти розмовляєш українською?" },
    ],
    tip: "У німецькому реченні дієслово завжди стоїть на 2 місці в простому розповідному реченні.",
    mistakes: [
      { wrong: "Ich gehen nach Hause.", right: "Ich gehe nach Hause." },
      { wrong: "Du bist sprechen Deutsch?", right: "Sprichst du Deutsch?" },
    ],
    exercises: {
      mc: { q: "___ du Kaffee?", options: ["Trinkt", "Trinkst", "Trinke", "Trinken"], correct: 1, explain: "2 особа однини: du trinkst." },
      gap: { q: "Wir ___ in Berlin. (wohnen)", answer: "wohnen", hint: "1 особа множини = інфінітив." },
    },
    nextSlug: "praesens",
  }),

  praesens: L({
    slug: "praesens", level: "A1", category: "Дієслова",
    titleDe: "Präsens", titleUk: "Теперішній час",
    goal: "Навчитися утворювати теперішній час правильних, неправильних і модальних дієслів.",
    explanation: [
      "<b>Präsens</b> — основний теперішній час. Уживається для дій зараз, для звичок, а також для майбутнього з обставинами часу.",
      "Особові закінчення: <b>-e, -st, -t, -en, -t, -en</b>. Сильні дієслова можуть змінювати кореневу голосну в 2 і 3 особі однини: <b>a → ä</b> (fahren → du fährst), <b>e → i/ie</b> (lesen → du liest).",
    ],
    table: {
      headers: ["", "machen", "fahren", "lesen", "sprechen"],
      rows: [
        ["ich", "mache", "fahre", "lese", "spreche"],
        ["du", "machst", "fährst", "liest", "sprichst"],
        ["er/sie/es", "macht", "fährt", "liest", "spricht"],
        ["wir", "machen", "fahren", "lesen", "sprechen"],
        ["ihr", "macht", "fahrt", "lest", "sprecht"],
        ["sie/Sie", "machen", "fahren", "lesen", "sprechen"],
      ],
    },
    examples: [
      { de: "Morgen fahre ich nach München.", uk: "Завтра я їду до Мюнхена.", tag: "майбутнє через Präsens" },
      { de: "Sie liest gerade ein Buch.", uk: "Вона зараз читає книгу." },
      { de: "Du sprichst sehr gut Deutsch!", uk: "Ти дуже добре розмовляєш німецькою!" },
    ],
    tip: "Якщо основа закінчується на -t, -d, -chn — додається <b>-e-</b> для зручної вимови: du arbeit<span class='hl'>e</span>st, er find<span class='hl'>e</span>t.",
    mistakes: [
      { wrong: "Du fahrst nach Hause.", right: "Du fährst nach Hause." },
      { wrong: "Er sprecht Englisch.", right: "Er spricht Englisch." },
    ],
    exercises: {
      mc: { q: "Er ___ gern Bücher.", options: ["lest", "liest", "lese", "list"], correct: 1, explain: "lesen → er liest (e → ie)." },
      ending: { q: "Du arbeit___ viel.", options: ["-st", "-est", "-t", "-en"], correct: "-est", hint: "Основа на -t → потрібне -e-." },
    },
    prevSlug: "verben", nextSlug: "perfekt",
  }),

  perfekt: L({
    slug: "perfekt", level: "A1", category: "Дієслова",
    titleDe: "Perfekt", titleUk: "Доконаний минулий час",
    goal: "Утворювати Perfekt з допоміжними дієсловами haben і sein та правильно ставити Partizip II.",
    explanation: [
      "<b>Perfekt</b> — основний минулий час в усному мовленні. Формула: <b>haben/sein</b> (на 2 місці) + <b>Partizip II</b> (в кінці).",
      "З <b>sein</b> вживаються дієслова руху (gehen, fahren, kommen) та зміни стану (aufstehen, einschlafen, werden), а також sein, bleiben, passieren. Усі інші — з <b>haben</b>.",
      "Partizip II слабких дієслів: <b>ge- + основа + -t</b> (machen → gemacht). Сильних: <b>ge- + (зміна) + -en</b> (gehen → gegangen, lesen → gelesen).",
    ],
    table: {
      headers: ["Position 1", "Position 2 (Hilfsverb)", "Mittelfeld", "Satzende (Partizip II)"],
      rows: [
        ["Ich", "habe", "gestern Deutsch", "gelernt."],
        ["Wir", "sind", "nach Berlin", "gefahren."],
        ["Anna", "hat", "einen Film", "gesehen."],
        ["Er", "ist", "um 7 Uhr", "aufgestanden."],
        ["Sie", "haben", "Pizza", "gegessen."],
        ["Ich", "habe", "mit Oma", "telefoniert."],
      ],
    },

    examples: [
      { de: "Ich habe gestern Deutsch gelernt.", uk: "Учора я вчила німецьку." },
      { de: "Wir sind nach Berlin gefahren.", uk: "Ми поїхали до Берліна.", tag: "sein" },
      { de: "Hast du das Buch gelesen?", uk: "Ти прочитав цю книгу?" },
      { de: "Sie ist um 7 Uhr aufgestanden.", uk: "Вона встала о 7-й.", tag: "sein" },
    ],
    tip: "Дієслова на <b>-ieren</b> (studieren, telefonieren) НЕ отримують префікс <b>ge-</b>: studiert, telefoniert.",
    mistakes: [
      { wrong: "Ich habe nach Hause gegangen.", right: "Ich bin nach Hause gegangen." },
      { wrong: "Er hat gestudiert.", right: "Er hat studiert." },
    ],
    exercises: {
      mc: { q: "Ich ___ ins Kino gegangen.", options: ["habe", "bin", "war", "hatte"], correct: 1, explain: "gehen — рух → sein." },
      gap: { q: "Wir ___ einen Film gesehen. (haben/sein?)", answer: "haben", hint: "sehen — не рух → haben." },
    },
    prevSlug: "praesens", nextSlug: "praeteritum",
  }),

  praeteritum: L({
    slug: "praeteritum", level: "A2", category: "Дієслова",
    titleDe: "Präteritum", titleUk: "Простий минулий час",
    goal: "Уживати Präteritum у письмових текстах і з допоміжними дієсловами sein, haben, модальними.",
    explanation: [
      "<b>Präteritum</b> — простий минулий час, типовий для письмових текстів (новин, книг, біографій). В усному мовленні переважно використовують лише з <b>sein, haben</b> і модальними дієсловами.",
      "Слабкі дієслова: основа + <b>-te-</b> + закінчення (machen → ich machte). Сильні дієслова змінюють корінь (gehen → ich ging, sein → ich war).",
    ],
    table: {
      headers: ["", "sein", "haben", "können", "machen", "gehen"],
      rows: [
        ["ich", "war", "hatte", "konnte", "machte", "ging"],
        ["du", "warst", "hattest", "konntest", "machtest", "gingst"],
        ["er/sie/es", "war", "hatte", "konnte", "machte", "ging"],
        ["wir", "waren", "hatten", "konnten", "machten", "gingen"],
        ["ihr", "wart", "hattet", "konntet", "machtet", "gingt"],
        ["sie/Sie", "waren", "hatten", "konnten", "machten", "gingen"],
      ],
    },
    examples: [
      { de: "Gestern war ich krank.", uk: "Учора я був хворий." },
      { de: "Sie hatte keine Zeit.", uk: "Вона не мала часу." },
      { de: "Als Kind konnte ich gut schwimmen.", uk: "У дитинстві я добре плавав." },
      { de: "Er ging jeden Morgen joggen.", uk: "Він щоранку ходив на пробіжку." },
    ],
    tip: "В 1 і 3 особі однини Präteritum <b>немає закінчення</b>: ich war, er war; ich machte, er machte.",
    mistakes: [
      { wrong: "Ich warte gestern müde.", right: "Ich war gestern müde." },
      { wrong: "Er gingte nach Hause.", right: "Er ging nach Hause." },
    ],
    exercises: {
      mc: { q: "Als Kind ___ ich oft krank.", options: ["bin", "war", "habe", "hatte"], correct: 1, explain: "sein у Präteritum → war." },
      gap: { q: "Wir ___ keine Zeit. (haben — Präteritum)", answer: "hatten" },
    },
    prevSlug: "perfekt", nextSlug: "futur1",
  }),

  futur1: L({
    slug: "futur1", level: "A2", category: "Дієслова",
    titleDe: "Futur I", titleUk: "Майбутній час",
    goal: "Утворювати майбутній час і розуміти, коли він обовʼязковий, а коли можна обійтися Präsens.",
    explanation: [
      "<b>Futur I</b> утворюється: <b>werden</b> (відмінюване) + <b>Infinitiv</b> (в кінці).",
      "Вживається для прогнозів (Es wird regnen), обіцянок (Ich werde dir helfen) і припущень (Sie wird zu Hause sein). Для конкретних планів частіше — Präsens з обставиною: <i>Morgen fahre ich nach Wien.</i>",
    ],
    table: {
      headers: ["", "werden"],
      rows: [
        ["ich", "werde"], ["du", "wirst"], ["er/sie/es", "wird"],
        ["wir", "werden"], ["ihr", "werdet"], ["sie/Sie", "werden"],
      ],
    },
    examples: [
      { de: "Ich werde dich morgen anrufen.", uk: "Я зателефоную тобі завтра.", tag: "обіцянка" },
      { de: "Es wird bald regnen.", uk: "Скоро піде дощ.", tag: "прогноз" },
      { de: "Sie wird wohl im Büro sein.", uk: "Вона, мабуть, в офісі.", tag: "припущення" },
    ],
    tip: "Слово <b>wohl</b> разом із Futur I часто означає «напевно/мабуть».",
    mistakes: [
      { wrong: "Ich werde morgen kommen werden.", right: "Ich werde morgen kommen." },
      { wrong: "Du wird kommen.", right: "Du wirst kommen." },
    ],
    exercises: {
      mc: { q: "Ich ___ dir helfen.", options: ["werde", "wirst", "wird", "werden"], correct: 0, explain: "ich werde." },
      gap: { q: "Morgen ___ es regnen. (werden, 3 Sg.)", answer: "wird" },
    },
    prevSlug: "praeteritum", nextSlug: "modalverben",
  }),

  modalverben: L({
    slug: "modalverben", level: "A1", category: "Дієслова",
    titleDe: "Modalverben", titleUk: "Модальні дієслова",
    goal: "Розрізняти значення können, müssen, dürfen, sollen, wollen, mögen / möchten і правильно будувати з ними речення.",
    explanation: [
      "Модальне дієслово стоїть на 2 місці й змінюється за особою, а смисловий <b>Infinitiv</b> — у кінці речення.",
      "В 1 і 3 особі однини модальні дієслова <b>не мають закінчення</b>: ich kann, er kann.",
    ],
    table: {
      headers: ["", "können", "müssen", "dürfen", "sollen", "wollen", "möchten"],
      rows: [
        ["ich", "kann", "muss", "darf", "soll", "will", "möchte"],
        ["du", "kannst", "musst", "darfst", "sollst", "willst", "möchtest"],
        ["er/sie/es", "kann", "muss", "darf", "soll", "will", "möchte"],
        ["wir", "können", "müssen", "dürfen", "sollen", "wollen", "möchten"],
        ["ihr", "könnt", "müsst", "dürft", "sollt", "wollt", "möchtet"],
        ["sie/Sie", "können", "müssen", "dürfen", "sollen", "wollen", "möchten"],
      ],
    },
    examples: [
      { de: "Ich kann gut Deutsch sprechen.", uk: "Я добре вмію розмовляти німецькою." },
      { de: "Du musst um 8 Uhr aufstehen.", uk: "Ти мусиш встати о 8-й." },
      { de: "Hier darf man nicht rauchen.", uk: "Тут не можна курити." },
      { de: "Ich möchte einen Kaffee, bitte.", uk: "Я б хотіла каву, будь ласка." },
    ],
    tip: "<b>müssen + nicht</b> = НЕ обовʼязково. Заборона — це <b>nicht dürfen</b>: <i>Du darfst nicht rauchen.</i>",
    mistakes: [
      { wrong: "Ich kann sprechen Deutsch gut.", right: "Ich kann gut Deutsch sprechen." },
      { wrong: "Er kannt schwimmen.", right: "Er kann schwimmen." },
    ],
    exercises: {
      mc: { q: "Hier ___ man nicht parken.", options: ["kann", "muss", "darf", "will"], correct: 2, explain: "Заборона → nicht dürfen." },
      gap: { q: "Ich ___ einen Tee, bitte. (möchten)", answer: "möchte" },
    },
    prevSlug: "futur1", nextSlug: "trennbare",
  }),

  trennbare: L({
    slug: "trennbare", level: "A1", category: "Дієслова",
    titleDe: "Trennbare Verben", titleUk: "Відокремлювані дієслова",
    goal: "Розпізнавати відокремлювані префікси й правильно ставити їх у кінець речення.",
    explanation: [
      "У <b>відокремлюваних</b> дієсловах префікс наголошений і у Präsens/Präteritum відокремлюється та стоїть у <b>кінці</b> речення.",
      "Найчастіші відокремлювані префікси: <b>auf-, an-, ab-, aus-, ein-, mit-, vor-, zu-, weg-, fest-, fern-</b>.",
      "У Perfekt префікс залишається з дієсловом, а <b>ge-</b> ставиться між префіксом і основою: aufstehen → <b>auf<span class='hl'>ge</span>standen</b>.",
    ],
    examples: [
      { de: "Ich stehe um 7 Uhr auf.", uk: "Я встаю о 7-й." },
      { de: "Wann fängt der Film an?", uk: "Коли починається фільм?" },
      { de: "Bitte machen Sie die Tür zu.", uk: "Будь ласка, зачиніть двері." },
      { de: "Sie ist früh aufgestanden.", uk: "Вона рано встала.", tag: "Perfekt" },
    ],
    tip: "У підрядному реченні дієслово й префікс знову <b>зʼєднуються</b>: …, weil ich um 7 Uhr <b>aufstehe</b>.",
    mistakes: [
      { wrong: "Ich aufstehe um 7.", right: "Ich stehe um 7 auf." },
      { wrong: "Er hat geaufstanden.", right: "Er ist aufgestanden." },
    ],
    exercises: {
      mc: { q: "Wann ___ der Unterricht ___ ?", options: ["fängt … an", "anfängt … —", "fängt … —", "anfängt … an"], correct: 0, explain: "anfangen → fängt … an." },
      gap: { q: "Ich ___ um 22 Uhr ___. (einschlafen — Präsens, 1 Sg.) → перша частина", answer: "schlafe" },
    },
    prevSlug: "modalverben", nextSlug: "untrennbare",
  }),

  untrennbare: L({
    slug: "untrennbare", level: "A2", category: "Дієслова",
    titleDe: "Untrennbare Verben", titleUk: "Невідокремлювані дієслова",
    goal: "Зрозуміти, які префікси не відокремлюються, і утворювати з ними Perfekt без ge-.",
    explanation: [
      "Невідокремлювані префікси: <b>be-, ge-, er-, ver-, zer-, ent-, emp-, miss-</b>. Вони <b>ненаголошені</b> та НЕ відокремлюються.",
      "У Perfekt такі дієслова <b>не отримують</b> префікс <b>ge-</b>: bezahlen → bezahlt, verstehen → verstanden.",
    ],
    examples: [
      { de: "Ich verstehe dich gut.", uk: "Я добре тебе розумію." },
      { de: "Hast du die Rechnung bezahlt?", uk: "Ти оплатив рахунок?" },
      { de: "Er erzählt eine Geschichte.", uk: "Він розповідає історію." },
    ],
    tip: "Префікс <b>durch-, über-, unter-, um-, wieder-</b> може бути як відокремлюваним, так і ні — залежить від значення (часто змінюється й наголос).",
    mistakes: [
      { wrong: "Ich habe das Buch geverstanden.", right: "Ich habe das Buch verstanden." },
      { wrong: "Bezahl bitte die Rechnung be.", right: "Bezahl bitte die Rechnung." },
    ],
    exercises: {
      mc: { q: "Ich habe alles ___ .", options: ["verstanden", "geverstanden", "verstand", "verstehen"], correct: 0, explain: "ver- — невідокремлюваний, без ge-." },
      gap: { q: "Er ___ die Rechnung. (bezahlen — Präsens)", answer: "bezahlt" },
    },
    prevSlug: "trennbare", nextSlug: "reflexive",
  }),

  reflexive: L({
    slug: "reflexive", level: "A2", category: "Дієслова",
    titleDe: "Reflexive Verben", titleUk: "Зворотні дієслова",
    goal: "Правильно вживати зворотні займенники в Akkusativ і Dativ.",
    explanation: [
      "Зворотні дієслова використовуються з зворотним займенником <b>sich</b>, який змінюється за особою.",
      "Більшість зворотних дієслів стоять із <b>Akkusativ</b>: sich freuen, sich beeilen. Деякі — з <b>Dativ</b>, коли в реченні є пряме доповнення: <i>Ich wasche mir die Hände.</i>",
    ],
    table: {
      headers: ["Person", "Akkusativ", "Dativ"],
      rows: [
        ["ich", "mich", "mir"], ["du", "dich", "dir"], ["er/sie/es", "sich", "sich"],
        ["wir", "uns", "uns"], ["ihr", "euch", "euch"], ["sie/Sie", "sich", "sich"],
      ],
    },
    examples: [
      { de: "Ich freue mich auf das Wochenende.", uk: "Я з нетерпінням чекаю вихідних.", tag: "Akk." },
      { de: "Beeil dich, wir sind spät dran!", uk: "Поспішай, ми спізнюємось!" },
      { de: "Ich wasche mir die Hände.", uk: "Я мию (собі) руки.", tag: "Dat." },
    ],
    tip: "Якщо в реченні з'являється друге доповнення (предмет) — займенник у <b>Dativ</b>: <i>Ich putze <b>mir</b> die Zähne</i>.",
    mistakes: [
      { wrong: "Ich freue auf den Urlaub.", right: "Ich freue mich auf den Urlaub." },
      { wrong: "Wasche dich die Hände.", right: "Wasch dir die Hände." },
    ],
    exercises: {
      mc: { q: "Ich interessiere ___ für Musik.", options: ["mir", "mich", "sich", "dich"], correct: 1, explain: "sich interessieren + Akk. → mich." },
      gap: { q: "Beeil ___ ! (du)", answer: "dich" },
    },
    prevSlug: "untrennbare", nextSlug: "verben-praep",
  }),

  "verben-praep": L({
    slug: "verben-praep", level: "B1", category: "Дієслова",
    titleDe: "Verben mit Präpositionen", titleUk: "Дієслова з прийменниками",
    goal: "Запам'ятати стійкі звʼязки «дієслово + прийменник + відмінок».",
    explanation: [
      "Багато дієслів вимагають конкретного прийменника та відмінка. Це треба <b>заучувати разом</b>: warten <b>auf</b> + Akk., denken <b>an</b> + Akk., sprechen <b>über</b> + Akk., helfen <b>bei</b> + Dat.",
      "Для запитань і відповідей про <b>речі</b> вживаються складені прислівники: <b>worauf?</b> — <b>darauf</b>; <b>woran?</b> — <b>daran</b>. Для людей — прийменник + займенник: <i>auf wen? — auf ihn</i>.",
    ],
    table: {
      headers: ["Дієслово", "Прийменник + відмінок", "Приклад"],
      rows: [
        ["warten", "auf + Akk.", "Ich warte auf den Bus."],
        ["denken", "an + Akk.", "Ich denke an dich."],
        ["sich freuen", "auf + Akk. / über + Akk.", "Ich freue mich auf den Urlaub."],
        ["sprechen", "über/von", "Wir sprechen über Politik."],
        ["helfen", "bei + Dat.", "Er hilft mir bei den Hausaufgaben."],
        ["sich interessieren", "für + Akk.", "Sie interessiert sich für Kunst."],
        ["Angst haben", "vor + Dat.", "Ich habe Angst vor Hunden."],
      ],
    },
    examples: [
      { de: "Worauf wartest du? – Auf den Bus.", uk: "На що ти чекаєш? – На автобус." },
      { de: "Auf wen wartest du? – Auf meinen Bruder.", uk: "Кого ти чекаєш? – Свого брата." },
      { de: "Ich denke oft an meine Familie.", uk: "Я часто думаю про свою родину." },
    ],
    tip: "<b>Wo(r)-</b> для речей, <b>прийменник + wen/wem</b> для людей. Якщо прийменник починається з голосної — додається <b>-r-</b>: <i>worauf, woran, worüber</i>.",
    mistakes: [
      { wrong: "Ich warte für den Bus.", right: "Ich warte auf den Bus." },
      { wrong: "Ich denke über dich.", right: "Ich denke an dich." },
    ],
    exercises: {
      mc: { q: "Ich freue mich ___ das Wochenende.", options: ["für", "auf", "über", "an"], correct: 1, explain: "sich freuen auf + Akk. (майбутнє)." },
      gap: { q: "Sie interessiert sich ___ Musik.", answer: "für" },
    },
    prevSlug: "reflexive", nextSlug: "konjunktiv2",
  }),

  konjunktiv2: L({
    slug: "konjunktiv2", level: "B1", category: "Дієслова",
    titleDe: "Konjunktiv II", titleUk: "Умовний спосіб",
    goal: "Висловлювати ввічливі прохання, поради, нереальні умови та бажання.",
    explanation: [
      "<b>Konjunktiv II</b> вживається для нереальних ситуацій, ввічливих прохань, порад і бажань. У більшості дієслів використовується форма <b>würde + Infinitiv</b>.",
      "Для <b>sein, haben</b> і модальних дієслів існують власні форми: <b>wäre, hätte, könnte, müsste, dürfte, sollte, wollte, möchte</b>.",
    ],
    table: {
      headers: ["", "sein → wäre", "haben → hätte", "können → könnte", "würde"],
      rows: [
        ["ich", "wäre", "hätte", "könnte", "würde"],
        ["du", "wärst", "hättest", "könntest", "würdest"],
        ["er/sie/es", "wäre", "hätte", "könnte", "würde"],
        ["wir", "wären", "hätten", "könnten", "würden"],
        ["ihr", "wärt", "hättet", "könntet", "würdet"],
        ["sie/Sie", "wären", "hätten", "könnten", "würden"],
      ],
    },
    examples: [
      { de: "Ich hätte gern einen Kaffee.", uk: "Я б хотіла каву.", tag: "ввічливо" },
      { de: "Wenn ich Zeit hätte, würde ich reisen.", uk: "Якби в мене був час, я б подорожувала.", tag: "нереальна умова" },
      { de: "Könnten Sie mir bitte helfen?", uk: "Чи могли б Ви мені допомогти?" },
      { de: "An deiner Stelle würde ich das nicht machen.", uk: "На твоєму місці я б цього не робив.", tag: "порада" },
    ],
    tip: "В нереальній умові <b>обидві</b> частини стоять у Konjunktiv II: <i>Wenn ich Geld <b>hätte</b>, <b>würde</b> ich reisen.</i>",
    mistakes: [
      { wrong: "Wenn ich Zeit habe, würde ich reisen.", right: "Wenn ich Zeit hätte, würde ich reisen." },
      { wrong: "Ich würde ein Kaffee haben.", right: "Ich hätte gern einen Kaffee." },
    ],
    exercises: {
      mc: { q: "Wenn ich du ___, würde ich gehen.", options: ["bin", "war", "wäre", "würde"], correct: 2, explain: "sein у K.II → wäre." },
      gap: { q: "___ Sie mir bitte helfen? (können — K.II)", answer: "Könnten" },
    },
    prevSlug: "verben-praep", nextSlug: "passiv",
  }),

  passiv: L({
    slug: "passiv", level: "B1", category: "Дієслова",
    titleDe: "Passiv", titleUk: "Пасивний стан",
    goal: "Утворювати пасив теперішнього й минулого часу та розуміти різницю Vorgangs- і Zustandspassiv.",
    explanation: [
      "<b>Vorgangspassiv</b> (процес): <b>werden</b> + <b>Partizip II</b>. <i>Das Auto wird repariert.</i>",
      "<b>Zustandspassiv</b> (стан/результат): <b>sein</b> + <b>Partizip II</b>. <i>Das Auto ist repariert.</i>",
      "Дійову особу можна вказати через <b>von + Dat.</b> (для людей) або <b>durch + Akk.</b> (для причини).",
    ],
    table: {
      headers: ["Час", "Формула", "Приклад"],
      rows: [
        ["Präsens Passiv", "wird + Part. II", "Der Brief wird geschrieben."],
        ["Präteritum Passiv", "wurde + Part. II", "Der Brief wurde geschrieben."],
        ["Perfekt Passiv", "ist + Part. II + worden", "Der Brief ist geschrieben worden."],
        ["Zustandspassiv", "ist + Part. II", "Der Brief ist geschrieben."],
      ],
    },
    examples: [
      { de: "Hier wird ein neues Haus gebaut.", uk: "Тут будують новий будинок." },
      { de: "Das Fenster wurde von dem Kind geöffnet.", uk: "Вікно було відкрите дитиною." },
      { de: "Die Tür ist schon geschlossen.", uk: "Двері вже зачинені.", tag: "Zustand" },
    ],
    tip: "У Perfekt Passiv замість <b>geworden</b> вживається <b>worden</b>: <i>Das Haus ist gebaut <b>worden</b>.</i>",
    mistakes: [
      { wrong: "Das Haus wird gebaut geworden.", right: "Das Haus ist gebaut worden." },
      { wrong: "Das Buch ist von mir gelesen.", right: "Das Buch wird/wurde von mir gelesen." },
    ],
    exercises: {
      mc: { q: "Das Auto ___ gerade repariert.", options: ["ist", "wird", "hat", "war"], correct: 1, explain: "Vorgangspassiv Präsens → wird." },
      gap: { q: "Der Brief wurde von Anna ___ . (schreiben — Part. II)", answer: "geschrieben" },
    },
    prevSlug: "konjunktiv2",
  }),

  // ============ SUBSTANTIVE / ARTIKEL / PRONOMEN ============
  substantive: L({
    slug: "substantive", level: "A1", category: "Іменники",
    titleDe: "Substantive", titleUk: "Іменники: рід та число",
    goal: "Розпізнавати рід іменника за закінченням і правильно утворювати множину.",
    explanation: [
      "Усі німецькі іменники пишуться з <b>великої літери</b> та мають один із трьох родів: <b>der</b> (м.р.), <b>die</b> (ж.р.), <b>das</b> (с.р.).",
      "Рід часто можна вгадати за закінченням: <b>-ung, -heit, -keit, -schaft, -tion, -ei</b> → <b>die</b>. <b>-chen, -lein, -um, -ment</b> → <b>das</b>. <b>-er, -ling, -ig, -ismus</b> → <b>der</b>.",
      "Множина утворюється по-різному: <b>-e, -en, -er, -s, -</b> (без закінчення, іноді з умлаутом). Її теж треба заучувати разом зі словом.",
    ],
    table: {
      headers: ["Закінчення", "Рід", "Приклад"],
      rows: [
        ["-ung", "die", "die Wohnung, die Zeitung"],
        ["-heit / -keit", "die", "die Freiheit, die Möglichkeit"],
        ["-tion", "die", "die Information, die Situation"],
        ["-chen / -lein", "das", "das Mädchen, das Büchlein"],
        ["-er (особа-чоловік)", "der", "der Lehrer, der Arbeiter"],
        ["-ismus", "der", "der Tourismus"],
      ],
    },
    examples: [
      { de: "die Wohnung — die Wohnungen", uk: "квартира — квартири" },
      { de: "das Kind — die Kinder", uk: "дитина — діти" },
      { de: "der Mann — die Männer", uk: "чоловік — чоловіки" },
      { de: "das Auto — die Autos", uk: "машина — машини" },
    ],
    tip: "У множині <b>артикль завжди die</b>, незалежно від роду в однині.",
    mistakes: [
      { wrong: "der Wohnung", right: "die Wohnung" },
      { wrong: "die Mädchen (одне дівча)", right: "das Mädchen" },
    ],
    exercises: {
      mc: { q: "___ Information ist wichtig.", options: ["Der", "Die", "Das", "Den"], correct: 1, explain: "-tion → die." },
      gap: { q: "Артикль для слова «Mädchen»:", answer: "das" },
    },
    nextSlug: "artikel",
  }),

  artikel: L({
    slug: "artikel", level: "A1", category: "Артиклі",
    titleDe: "Bestimmter & unbestimmter Artikel", titleUk: "Означений і неозначений артикль",
    goal: "Розрізняти, коли вживати der/die/das, а коли ein/eine, а також правильно заперечувати через kein.",
    explanation: [
      "<b>Неозначений артикль</b> (ein/eine) — коли річ нова або згадується вперше. <b>Означений</b> (der/die/das) — коли вже відома або єдина.",
      "Заперечення іменника з ein/eine або без артикля — через <b>kein/keine</b>: <i>Ich habe <b>keinen</b> Hund.</i>",
    ],
    table: {
      headers: ["Kasus", "der (m)", "die (f)", "das (n)", "die (Pl.)"],
      rows: [
        ["Nominativ", "der / ein", "die / eine", "das / ein", "die / —"],
        ["Akkusativ", "den / einen", "die / eine", "das / ein", "die / —"],
        ["Dativ", "dem / einem", "der / einer", "dem / einem", "den / —"],
        ["Genitiv", "des / eines", "der / einer", "des / eines", "der / —"],
      ],
    },
    examples: [
      { de: "Ich sehe einen Hund. Der Hund ist braun.", uk: "Я бачу собаку. Собака коричневий." },
      { de: "Sie hat eine Schwester.", uk: "У неї є сестра." },
      { de: "Wir haben kein Auto.", uk: "У нас немає машини." },
    ],
    tip: "Перед професіями та національностями артикль <b>не вживається</b>: <i>Er ist Lehrer. Sie ist Ukrainerin.</i>",
    mistakes: [
      { wrong: "Ich bin ein Lehrer.", right: "Ich bin Lehrer." },
      { wrong: "Ich habe nicht ein Auto.", right: "Ich habe kein Auto." },
    ],
    exercises: {
      mc: { q: "Ich habe ___ Auto.", options: ["nicht", "kein", "keinen", "nein"], correct: 0, explain: "Auto — das, Akk. = das. Заперечення → kein. Але тут правильно: «kein Auto». Уважно!" },
      gap: { q: "Ich trinke ___ Kaffee. (неозн. артикль, Akk., m)", answer: "einen" },
    },
    nextSlug: "pronomen",
  }),

  pronomen: L({
    slug: "pronomen", level: "A1", category: "Займенники",
    titleDe: "Pronomen", titleUk: "Особові, присвійні та зворотні займенники",
    goal: "Уміти правильно змінювати займенники в Nominativ, Akkusativ і Dativ.",
    explanation: [
      "Особові займенники змінюються за відмінками. У Dativ і Akkusativ форми різні: <i>mich/mir, dich/dir, ihn/ihm, sie/ihr</i>.",
      "Присвійні займенники узгоджуються з іменником у роді, числі та відмінку, як <b>ein-</b>: <i>mein Bruder, meine Schwester, mein Kind, meine Eltern</i>.",
    ],
    table: {
      headers: ["Nom.", "Akk.", "Dat.", "Posses."],
      rows: [
        ["ich", "mich", "mir", "mein"],
        ["du", "dich", "dir", "dein"],
        ["er", "ihn", "ihm", "sein"],
        ["sie", "sie", "ihr", "ihr"],
        ["es", "es", "ihm", "sein"],
        ["wir", "uns", "uns", "unser"],
        ["ihr", "euch", "euch", "euer"],
        ["sie/Sie", "sie/Sie", "ihnen/Ihnen", "ihr/Ihr"],
      ],
    },
    examples: [
      { de: "Ich sehe ihn jeden Tag.", uk: "Я бачу його щодня.", tag: "Akk." },
      { de: "Ich helfe ihr gern.", uk: "Я охоче їй допомагаю.", tag: "Dat." },
      { de: "Das ist mein Bruder und seine Frau.", uk: "Це мій брат і його дружина." },
    ],
    tip: "Деякі дієслова керують <b>Dativ</b>: helfen, danken, gefallen, gehören, antworten. Запам'ятай їх.",
    mistakes: [
      { wrong: "Ich helfe ihn.", right: "Ich helfe ihm." },
      { wrong: "Das ist mein Schwester.", right: "Das ist meine Schwester." },
    ],
    exercises: {
      mc: { q: "Ich gebe ___ das Buch.", options: ["sie", "ihr", "ihre", "ihren"], correct: 1, explain: "geben + Dativ → ihr (їй)." },
      gap: { q: "Das ist ___ Schwester. (моя)", answer: "meine" },
    },
  }),

  // ============ ADJEKTIVE ============
  adjektive: L({
    slug: "adjektive", level: "A2", category: "Прикметники",
    titleDe: "Adjektive — Überblick", titleUk: "Прикметники — загальний огляд",
    goal: "Зрозуміти, коли прикметник відмінюється, а коли ні, та яку роль виконує.",
    explanation: [
      "Якщо прикметник стоїть <b>після</b> дієслова (sein, werden, bleiben) — він <b>не відмінюється</b>: <i>Das Haus ist <b>groß</b>.</i>",
      "Якщо прикметник стоїть <b>перед іменником</b> — він <b>відмінюється</b> і залежить від артикля: означений, неозначений або без артикля.",
    ],
    examples: [
      { de: "Das Wetter ist schön.", uk: "Погода гарна.", tag: "не відмін." },
      { de: "Es ist ein schöner Tag.", uk: "Гарний день.", tag: "відмін." },
      { de: "Der große Hund bellt laut.", uk: "Великий собака голосно гавкає." },
    ],
    tip: "Прикметник, який стоїть як прислівник (характеризує дію), теж <b>не змінюється</b>: <i>Sie singt <b>schön</b>.</i>",
    mistakes: [
      { wrong: "Das Haus ist großes.", right: "Das Haus ist groß." },
      { wrong: "Ein schön Tag.", right: "Ein schöner Tag." },
    ],
    exercises: {
      mc: { q: "Das Auto ist ___.", options: ["neue", "neuer", "neu", "neues"], correct: 2, explain: "Після sein — без закінчення." },
      gap: { q: "Es ist ein ___ Tag. (schön, m, Nom.)", answer: "schöner" },
    },
    nextSlug: "adjektivdeklination-bestimmter",
  }),

  "adjektivdeklination-bestimmter": L({
    slug: "adjektivdeklination-bestimmter", level: "B1", category: "Прикметники",
    titleDe: "Adjektivdeklination nach dem bestimmten Artikel",
    titleUk: "Відмінювання прикметників після означеного артикля",
    goal: "Навчитися правильно ставити закінчення прикметників після означеного артикля у всіх чотирьох відмінках.",
    explanation: [
      "Коли перед прикметником стоїть <b>означений артикль</b> (der/die/das/die), артикль уже несе всю інформацію про рід, число й відмінок.",
      "Тому прикметник отримує лише два варіанти: <span class='hl'>-e</span> або <span class='hl'>-en</span>.",
    ],
    table: {
      headers: ["Kasus", "Maskulin", "Feminin", "Neutrum", "Plural"],
      rows: [
        ["Nominativ", "der gut-e", "die gut-e", "das gut-e", "die gut-en"],
        ["Akkusativ", "den gut-en", "die gut-e", "das gut-e", "die gut-en"],
        ["Dativ", "dem gut-en", "der gut-en", "dem gut-en", "den gut-en"],
        ["Genitiv", "des gut-en", "der gut-en", "des gut-en", "der gut-en"],
      ],
    },
    examples: [
      { de: "Der große Mann liest die interessante Zeitung.", uk: "Високий чоловік читає цікаву газету.", tag: "Nom. + Akk." },
      { de: "Ich helfe dem netten Nachbarn.", uk: "Я допомагаю люб'язному сусідові.", tag: "Dativ" },
      { de: "Das Auto des jungen Mannes ist neu.", uk: "Машина молодого чоловіка нова.", tag: "Genitiv" },
      { de: "Die kleinen Kinder spielen im Park.", uk: "Маленькі діти граються в парку.", tag: "Plural" },
    ],
    tip: "Після <b>der/die/das</b> у Nom. однини та в Akk. жіночого/середнього роду — <b>-e</b>. В усіх інших — <b>-en</b>.",
    mistakes: [
      { wrong: "Ich sehe den groß Mann.", right: "Ich sehe den großen Mann." },
      { wrong: "die klein Kinder", right: "die kleinen Kinder" },
    ],
    exercises: {
      mc: { q: "Ich kenne den ___ Lehrer.", options: ["nette", "netten", "nett", "nettem"], correct: 1, explain: "Akk. m → -en." },
      gap: { q: "Sie liest die ___ Zeitung. (interessant)", answer: "interessante", hint: "Akk., f → -e." },
      ending: { q: "Die klein___ Kinder spielen im Park.", options: ["-e", "-en", "-er", "-es"], correct: "-en", hint: "Plural → завжди -en." },
    },
    prevSlug: "adjektive", nextSlug: "komparativ-superlativ",
  }),

  "komparativ-superlativ": L({
    slug: "komparativ-superlativ", level: "A2", category: "Прикметники",
    titleDe: "Komparativ und Superlativ", titleUk: "Ступені порівняння прикметників",
    goal: "Утворювати вищий і найвищий ступені та правильно порівнювати.",
    explanation: [
      "Вищий ступінь: прикметник + <b>-er</b> (klein → kleiner). Найвищий: <b>am</b> + прикметник + <b>-(e)sten</b> (am kleinsten) або <b>der/die/das …ste</b>.",
      "Багато коротких прикметників отримують <b>умлаут</b>: alt → älter → am ältesten; groß → größer → am größten.",
      "Порівняння: <b>so … wie</b> (рівність), <b>…-er als</b> (нерівність).",
    ],
    table: {
      headers: ["Positiv", "Komparativ", "Superlativ"],
      rows: [
        ["klein", "kleiner", "am kleinsten"],
        ["alt", "älter", "am ältesten"],
        ["groß", "größer", "am größten"],
        ["gut", "besser", "am besten"],
        ["viel", "mehr", "am meisten"],
        ["gern", "lieber", "am liebsten"],
        ["hoch", "höher", "am höchsten"],
      ],
    },
    examples: [
      { de: "Anna ist größer als Lisa.", uk: "Анна вища за Лізу." },
      { de: "Mein Bruder ist so alt wie ich.", uk: "Мій брат такий же старший, як і я." },
      { de: "Im Sommer ist es am heißesten.", uk: "Влітку найспекотніше." },
    ],
    tip: "Перед іменником найвищий ступінь стоїть з означеним артиклем і відмінюється: <i>der <b>beste</b> Freund</i>.",
    mistakes: [
      { wrong: "Anna ist mehr groß als Lisa.", right: "Anna ist größer als Lisa." },
      { wrong: "Er ist so alt als ich.", right: "Er ist so alt wie ich." },
    ],
    exercises: {
      mc: { q: "Berlin ist ___ als München.", options: ["groß", "größer", "am größten", "größere"], correct: 1, explain: "порівняння → -er + als." },
      gap: { q: "Ich trinke am ___ Tee. (gern)", answer: "liebsten" },
    },
    prevSlug: "adjektivdeklination-bestimmter", nextSlug: "adjektive-praep",
  }),

  "adjektive-praep": L({
    slug: "adjektive-praep", level: "B1", category: "Прикметники",
    titleDe: "Adjektive mit Präpositionen", titleUk: "Прикметники з прийменниками",
    goal: "Запам'ятати, з якими прийменниками вживаються поширені прикметники.",
    explanation: [
      "Як і дієслова, прикметники часто мають фіксований прийменник + відмінок: <b>stolz auf</b> + Akk., <b>zufrieden mit</b> + Dat., <b>verliebt in</b> + Akk., <b>bekannt für</b> + Akk.",
    ],
    table: {
      headers: ["Прикметник", "Прийменник", "Приклад"],
      rows: [
        ["stolz", "auf + Akk.", "Ich bin stolz auf meine Tochter."],
        ["zufrieden", "mit + Dat.", "Er ist zufrieden mit der Arbeit."],
        ["verliebt", "in + Akk.", "Sie ist in ihn verliebt."],
        ["bekannt", "für + Akk.", "Die Stadt ist bekannt für ihr Bier."],
        ["abhängig", "von + Dat.", "Das ist abhängig vom Wetter."],
        ["bereit", "zu + Dat.", "Bist du bereit zur Prüfung?"],
      ],
    },
    examples: [
      { de: "Wir sind sehr zufrieden mit dem Hotel.", uk: "Ми дуже задоволені готелем." },
      { de: "Sie ist stolz auf ihren Sohn.", uk: "Вона пишається своїм сином." },
    ],
    tip: "У запитаннях про речі — знов <b>wo(r)-</b> форми: <i>Worauf bist du stolz?</i>",
    mistakes: [
      { wrong: "Ich bin stolz für meine Tochter.", right: "Ich bin stolz auf meine Tochter." },
      { wrong: "zufrieden über die Arbeit", right: "zufrieden mit der Arbeit" },
    ],
    exercises: {
      mc: { q: "Sie ist zufrieden ___ der Note.", options: ["mit", "auf", "für", "über"], correct: 0, explain: "zufrieden mit + Dat." },
      gap: { q: "Ich bin stolz ___ meine Familie. (Präp.)", answer: "auf" },
    },
    prevSlug: "komparativ-superlativ", nextSlug: "partizipien",
  }),

  partizipien: L({
    slug: "partizipien", level: "B2", category: "Прикметники",
    titleDe: "Partizipien als Adjektive", titleUk: "Дієприкметники як прикметники",
    goal: "Уживати Partizip I та Partizip II як прикметники перед іменником.",
    explanation: [
      "<b>Partizip I</b> = Infinitiv + <b>-d</b> (lachen → lachend). Означає дію, що відбувається одночасно. <i>das lachende Kind</i> — дитина, яка сміється.",
      "<b>Partizip II</b> (gemacht, gelesen) як прикметник означає завершену або пасивну дію. <i>der gekochte Reis</i> — зварений рис.",
      "Як прикметники вони <b>відмінюються</b> за загальними правилами.",
    ],
    examples: [
      { de: "Das lachende Kind ist süß.", uk: "Дитина, що сміється, мила.", tag: "P I" },
      { de: "Der gekochte Reis schmeckt gut.", uk: "Зварений рис смачний.", tag: "P II" },
      { de: "Ich sehe einen schlafenden Hund.", uk: "Я бачу собаку, що спить." },
    ],
    tip: "Partizip I = активна дія в процесі; Partizip II = завершена/пасивна дія.",
    mistakes: [
      { wrong: "das lachen Kind", right: "das lachende Kind" },
      { wrong: "der kochend Reis (про зварений)", right: "der gekochte Reis" },
    ],
    exercises: {
      mc: { q: "Ich höre ___ Musik. (laufen)", options: ["laufende", "gelaufene", "läufend", "laufenden"], correct: 0, explain: "P I + die Musik (Akk., f) → -e." },
      gap: { q: "der ___ Brief (geschrieben, m, Nom.)", answer: "geschriebene" },
    },
    prevSlug: "adjektive-praep",
  }),

  // ============ ADVERBIEN / PRÄPOSITIONEN / KONJUNKTIONEN ============
  adverbien: L({
    slug: "adverbien", level: "A2", category: "Прислівники",
    titleDe: "Adverbien", titleUk: "Прислівники місця, часу та способу",
    goal: "Розрізняти типи прислівників і правильно дотримуватись порядку TeKaMoLo.",
    explanation: [
      "Прислівники <b>не змінюються</b>. Найважливіші групи: <b>часу</b> (heute, morgen, oft), <b>місця</b> (hier, dort, oben), <b>способу</b> (gern, schnell, leider), <b>причини</b> (deshalb, trotzdem).",
      "Порядок обставин у реченні: <b>Te-Ka-Mo-Lo</b> = <b>Te</b>mporal (коли) → <b>Ka</b>usal (чому) → <b>Mo</b>dal (як) → <b>Lo</b>kal (де/куди).",
    ],
    examples: [
      { de: "Ich fahre morgen wegen der Arbeit schnell nach Berlin.", uk: "Завтра я через роботу швидко їду до Берліна.", tag: "TeKaMoLo" },
      { de: "Hier ist es sehr ruhig.", uk: "Тут дуже тихо." },
      { de: "Leider habe ich keine Zeit.", uk: "На жаль, я не маю часу." },
    ],
    tip: "Прислівник на 1 місці зсуває підмет за дієсловом: <i><b>Morgen</b> fahre ich nach Berlin.</i>",
    mistakes: [
      { wrong: "Ich fahre nach Berlin morgen schnell.", right: "Ich fahre morgen schnell nach Berlin." },
      { wrong: "Morgen ich fahre nach Berlin.", right: "Morgen fahre ich nach Berlin." },
    ],
    exercises: {
      mc: { q: "Який порядок правильний?", options: [
        "Ich gehe ins Kino heute mit Anna.",
        "Ich gehe heute mit Anna ins Kino.",
        "Heute ich gehe mit Anna ins Kino.",
        "Ich heute gehe mit Anna ins Kino.",
      ], correct: 1, explain: "Te → Mo → Lo." },
      gap: { q: "Прислівник «на жаль» німецькою:", answer: "leider" },
    },
  }),

  praepositionen: L({
    slug: "praepositionen", level: "A2", category: "Прийменники",
    titleDe: "Präpositionen", titleUk: "Прийменники з Akk., Dat., Gen.",
    goal: "Знати, який відмінок іде після кожного прийменника, та правильно вживати «Wechselpräpositionen».",
    explanation: [
      "<b>Akkusativ</b>: durch, für, gegen, ohne, um, bis. <b>Dativ</b>: aus, bei, mit, nach, seit, von, zu, gegenüber. <b>Genitiv</b>: trotz, während, wegen, statt.",
      "<b>Wechselpräpositionen</b> (an, auf, hinter, in, neben, über, unter, vor, zwischen) — <b>Akk.</b> на питання <i>Wohin?</i> (рух/напрямок), <b>Dat.</b> на питання <i>Wo?</i> (місце).",
    ],
    table: {
      headers: ["Питання", "Відмінок", "Приклад"],
      rows: [
        ["Wo?", "Dativ", "Ich bin in der Schule."],
        ["Wohin?", "Akkusativ", "Ich gehe in die Schule."],
        ["Wo?", "Dativ", "Das Buch liegt auf dem Tisch."],
        ["Wohin?", "Akkusativ", "Ich lege das Buch auf den Tisch."],
      ],
    },
    examples: [
      { de: "Wir fahren mit dem Bus zur Arbeit.", uk: "Ми їдемо на роботу автобусом." },
      { de: "Wegen des Regens bleiben wir zu Hause.", uk: "Через дощ ми залишаємось удома.", tag: "Gen." },
      { de: "Ich hänge das Bild an die Wand.", uk: "Я вішаю картину на стіну.", tag: "Wohin → Akk." },
    ],
    tip: "Запам'ятай скорочення: <b>am = an dem, im = in dem, zur = zu der, zum = zu dem, ins = in das, ans = an das</b>.",
    mistakes: [
      { wrong: "Ich gehe in der Schule. (рух)", right: "Ich gehe in die Schule." },
      { wrong: "mit der Bus", right: "mit dem Bus" },
    ],
    exercises: {
      mc: { q: "Ich gehe ___ Schule.", options: ["in der", "in die", "zur", "nach"], correct: 1, explain: "Wohin → Akk., f → die." },
      gap: { q: "Wir wohnen ___ Berlin. (in)", answer: "in" },
    },
  }),

  konjunktionen: L({
    slug: "konjunktionen", level: "B1", category: "Сполучники",
    titleDe: "Konjunktionen", titleUk: "Сурядні та підрядні сполучники",
    goal: "Розрізняти сполучники, що змінюють або не змінюють порядок слів.",
    explanation: [
      "<b>Сурядні</b> (und, aber, oder, denn, sondern) — НЕ змінюють порядок слів. Підмет залишається на 1 місці.",
      "<b>Підрядні</b> (weil, dass, wenn, obwohl, ob, als, während) — дієслово йде в <b>кінець</b> підрядного речення.",
      "<b>Прислівники-сполучники</b> (deshalb, trotzdem, dann, sonst) — стоять на 1 місці, дієслово на 2: <i>Es regnet, <b>deshalb</b> bleibe ich zu Hause.</i>",
    ],
    examples: [
      { de: "Ich lerne Deutsch, weil ich in Berlin lebe.", uk: "Я вчу німецьку, бо живу в Берліні.", tag: "weil → kінець" },
      { de: "Es regnet, aber ich gehe spazieren.", uk: "Іде дощ, але я йду гуляти." },
      { de: "Ich weiß, dass du müde bist.", uk: "Я знаю, що ти втомлений." },
    ],
    tip: "<b>weil</b> і <b>denn</b> мають однакове значення «бо», але <b>denn</b> — сурядний (без зміни порядку), <b>weil</b> — підрядний (дієслово в кінець).",
    mistakes: [
      { wrong: "Ich bleibe zu Hause, weil es regnet stark.", right: "…, weil es stark regnet." },
      { wrong: "Es regnet, deshalb ich bleibe zu Hause.", right: "Es regnet, deshalb bleibe ich zu Hause." },
    ],
    exercises: {
      mc: { q: "Ich komme nicht, ___ ich krank bin.", options: ["denn", "weil", "deshalb", "aber"], correct: 1, explain: "Дієслово «bin» у кінці → weil." },
      gap: { q: "Es ist spät, ___ ich gehe nach Hause. (тому)", answer: "deshalb" },
    },
  }),

  // ============ SATZBAU / ZEITEN ============
  satzbau: L({
    slug: "satzbau", level: "A2", category: "Будова речення",
    titleDe: "Satzbau", titleUk: "Прямий, зворотний порядок слів та підрядне речення",
    goal: "Розуміти позицію дієслова в простому, інвертованому, питальному та підрядному реченні.",
    explanation: [
      "У <b>розповідному</b> реченні дієслово завжди на <b>2 місці</b>. На 1 місці може бути підмет (прямий порядок) або інша частина — тоді підмет іде за дієсловом (інверсія).",
      "У <b>питанні без питального слова</b> дієслово стоїть на <b>1 місці</b>: <i>Kommst du mit?</i>. З питальним словом — на 2: <i>Wann kommst du?</i>",
      "У <b>підрядному реченні</b> (з weil, dass, wenn, ob…) дієслово йде в <b>кінець</b>.",
    ],
    examples: [
      { de: "Ich gehe heute ins Kino.", uk: "Я йду сьогодні в кіно.", tag: "прямий" },
      { de: "Heute gehe ich ins Kino.", uk: "Сьогодні я йду в кіно.", tag: "інверсія" },
      { de: "Kommst du mit?", uk: "Підеш зі мною?", tag: "питання" },
      { de: "Ich weiß, dass du müde bist.", uk: "Я знаю, що ти втомлений.", tag: "підр." },
    ],
    tip: "У складених часах (Perfekt, Futur, з модальним дієсловом) <b>смислове</b> дієслово йде в кінець, а допоміжне/модальне — на 2 місце.",
    mistakes: [
      { wrong: "Heute ich gehe ins Kino.", right: "Heute gehe ich ins Kino." },
      { wrong: "…, weil ich bin müde.", right: "…, weil ich müde bin." },
    ],
    exercises: {
      mc: { q: "Який порядок правильний у підрядному?", options: [
        "Ich bleibe zu Hause, weil ich bin krank.",
        "Ich bleibe zu Hause, weil bin ich krank.",
        "Ich bleibe zu Hause, weil ich krank bin.",
        "Ich bleibe zu Hause, weil krank ich bin.",
      ], correct: 2, explain: "Дієслово в кінець." },
      gap: { q: "Постав на 2 місце дієслово: «Morgen ___ ich nach Wien.» (fahren)", answer: "fahre" },
    },
  }),

  zeiten: L({
    slug: "zeiten", level: "B1", category: "Часи",
    titleDe: "Zeiten — Überblick", titleUk: "Огляд усіх часів",
    goal: "Систематизувати знання про шість основних часів німецької мови.",
    explanation: [
      "Шість часів: <b>Präsens, Perfekt, Präteritum, Plusquamperfekt, Futur I, Futur II</b>.",
      "<b>Plusquamperfekt</b> (передминулий) утворюється: <b>hatte/war</b> + Partizip II. Уживається для дії, що відбулась <i>раніше</i> за іншу минулу: <i>Nachdem ich gegessen <b>hatte</b>, ging ich spazieren.</i>",
      "<b>Futur II</b> (доконаний майбутній) для припущень про минуле: <i>Er wird wohl angekommen sein.</i>",
    ],
    table: {
      headers: ["Час", "Формула", "Приклад"],
      rows: [
        ["Präsens", "—", "Ich lerne."],
        ["Perfekt", "haben/sein + P II", "Ich habe gelernt."],
        ["Präteritum", "form. minulyy", "Ich lernte."],
        ["Plusquamperfekt", "hatte/war + P II", "Ich hatte gelernt."],
        ["Futur I", "werden + Inf.", "Ich werde lernen."],
        ["Futur II", "werden + P II + haben/sein", "Ich werde gelernt haben."],
      ],
    },
    examples: [
      { de: "Nachdem ich gegessen hatte, ging ich spazieren.", uk: "Поївши, я пішов гуляти.", tag: "Plusq." },
      { de: "Bis morgen werde ich alles erledigt haben.", uk: "До завтра я з усім впораюсь.", tag: "Futur II" },
    ],
    tip: "В усному мовленні минуле — Perfekt; у письмових текстах — Präteritum. Plusquamperfekt майже завжди йде разом з Präteritum.",
    mistakes: [
      { wrong: "Nachdem ich aß, ging ich spazieren.", right: "Nachdem ich gegessen hatte, ging ich spazieren." },
    ],
    exercises: {
      mc: { q: "Який це час: «Ich hatte schon gegessen»?", options: ["Perfekt", "Präteritum", "Plusquamperfekt", "Futur II"], correct: 2, explain: "hatte + P II → Plusquamperfekt." },
      gap: { q: "Допоміжне дієслово в «Ich ___ gefahren» (Perfekt):", answer: "bin" },
    },
  }),

  // ============ FÄLLE ============
  nominativ: L({
    slug: "nominativ", level: "A1", category: "Відмінки",
    titleDe: "Nominativ", titleUk: "Називний відмінок",
    goal: "Розпізнавати підмет у реченні та правильно ставити артикль у Nominativ.",
    explanation: [
      "<b>Nominativ</b> відповідає на питання <b>Wer? Was?</b> (хто? що?) і вживається для <b>підмета</b> та після дієслів sein, werden, bleiben (предикатив).",
    ],
    table: {
      headers: ["", "der (m)", "die (f)", "das (n)", "die (Pl.)"],
      rows: [["Nom.", "der / ein", "die / eine", "das / ein", "die / —"]],
    },
    examples: [
      { de: "Der Mann arbeitet.", uk: "Чоловік працює." },
      { de: "Das ist meine Schwester.", uk: "Це моя сестра." },
      { de: "Sie wird Ärztin.", uk: "Вона стане лікаркою." },
    ],
    tip: "Після <b>sein, werden, bleiben</b> другий іменник теж стоїть у Nominativ, а не в Akkusativ.",
    mistakes: [
      { wrong: "Er ist einen Lehrer.", right: "Er ist ein Lehrer." },
    ],
    exercises: {
      mc: { q: "___ Frau heißt Maria.", options: ["Der", "Die", "Das", "Den"], correct: 1, explain: "Frau — die." },
      gap: { q: "«Це мій брат»:", answer: "Das ist mein Bruder" },
    },
    nextSlug: "akkusativ",
  }),

  akkusativ: L({
    slug: "akkusativ", level: "A1", category: "Відмінки",
    titleDe: "Akkusativ", titleUk: "Знахідний відмінок",
    goal: "Уживати Akkusativ для прямого доповнення та з відповідними прийменниками.",
    explanation: [
      "<b>Akkusativ</b> відповідає на <b>Wen? Was?</b>. Тільки чоловічий рід змінює артикль: <b>der → den</b>, <b>ein → einen</b>.",
      "Akkusativ потребують: більшість дієслів (haben, sehen, kaufen, brauchen) і прийменники <b>durch, für, gegen, ohne, um, bis</b>.",
    ],
    table: {
      headers: ["", "der → den", "die → die", "das → das", "die (Pl.)"],
      rows: [["Akk.", "den / einen", "die / eine", "das / ein", "die / —"]],
    },
    examples: [
      { de: "Ich kaufe einen Apfel.", uk: "Я купую яблуко." },
      { de: "Wir sehen den Film.", uk: "Ми дивимось цей фільм." },
      { de: "Ich gehe ohne dich.", uk: "Я йду без тебе." },
    ],
    tip: "Лише <b>чоловічий рід</b> змінюється в Akkusativ. Жіночий, середній і множина — як у Nominativ.",
    mistakes: [
      { wrong: "Ich sehe der Mann.", right: "Ich sehe den Mann." },
      { wrong: "Ich habe einen Auto.", right: "Ich habe ein Auto." },
    ],
    exercises: {
      mc: { q: "Ich trinke ___ Kaffee.", options: ["der", "den", "ein", "einen"], correct: 3, explain: "Akk. m → einen." },
      gap: { q: "Ich brauche ___ Stift. (неозн., m)", answer: "einen" },
    },
    prevSlug: "nominativ", nextSlug: "dativ",
  }),

  dativ: L({
    slug: "dativ", level: "A2", category: "Відмінки",
    titleDe: "Dativ", titleUk: "Давальний відмінок",
    goal: "Розрізняти дієслова та прийменники, що керують Dativ.",
    explanation: [
      "<b>Dativ</b> відповідає на <b>Wem?</b> (кому?). Зміни артикля: <b>der/das → dem</b>, <b>die → der</b>, <b>die (Pl.) → den + -n</b> до іменника.",
      "Dativ потребують дієслова <b>helfen, danken, gefallen, gehören, antworten, gratulieren</b> і прийменники <b>aus, bei, mit, nach, seit, von, zu, gegenüber</b>.",
    ],
    table: {
      headers: ["", "m", "f", "n", "Pl."],
      rows: [["Dat.", "dem / einem", "der / einer", "dem / einem", "den + -n / —"]],
    },
    examples: [
      { de: "Ich helfe meiner Mutter.", uk: "Я допомагаю мамі." },
      { de: "Das Buch gehört dem Lehrer.", uk: "Книга належить вчителю." },
      { de: "Wir fahren mit den Kindern in den Urlaub.", uk: "Ми їдемо з дітьми у відпустку." },
    ],
    tip: "У множині в Dativ до іменника додається <b>-n</b>, якщо його там ще немає: <i>den Kinder<b>n</b>, den Männer<b>n</b></i>.",
    mistakes: [
      { wrong: "Ich helfe meine Mutter.", right: "Ich helfe meiner Mutter." },
      { wrong: "mit den Kinder", right: "mit den Kindern" },
    ],
    exercises: {
      mc: { q: "Ich danke ___ Lehrer.", options: ["der", "den", "dem", "des"], correct: 2, explain: "danken + Dat., m → dem." },
      gap: { q: "Ich helfe ___ Frau. (озн., f, Dat.)", answer: "der" },
    },
    prevSlug: "akkusativ", nextSlug: "genitiv",
  }),

  genitiv: L({
    slug: "genitiv", level: "B1", category: "Відмінки",
    titleDe: "Genitiv", titleUk: "Родовий відмінок",
    goal: "Уживати Genitiv для приналежності та з відповідними прийменниками.",
    explanation: [
      "<b>Genitiv</b> відповідає на <b>Wessen?</b> (чий?). Артикль: <b>des/eines</b> (m, n) + <b>-s/-es</b> до іменника; <b>der/einer</b> (f, Pl.).",
      "Прийменники з Genitiv: <b>trotz, während, wegen, statt, innerhalb, außerhalb</b>. У розмовній мові часто замінюються на Dativ: <i>wegen dem Wetter</i>.",
    ],
    table: {
      headers: ["", "m", "f", "n", "Pl."],
      rows: [["Gen.", "des -(e)s / eines -(e)s", "der / einer", "des -(e)s / eines -(e)s", "der / —"]],
    },
    examples: [
      { de: "Das ist das Auto meines Bruders.", uk: "Це машина мого брата." },
      { de: "Trotz des Regens spielen wir Fußball.", uk: "Незважаючи на дощ, ми граємо у футбол." },
      { de: "Während der Pause trinke ich Kaffee.", uk: "Під час перерви я пʼю каву." },
    ],
    tip: "Чоловічі й середні іменники в Genitiv однини отримують <b>-s</b> (Bruder<b>s</b>, Auto<b>s</b>) або <b>-es</b> після s/ß/x/z (Hause<b>s</b>).",
    mistakes: [
      { wrong: "das Auto mein Bruder", right: "das Auto meines Bruders" },
      { wrong: "trotz der Regen", right: "trotz des Regens" },
    ],
    exercises: {
      mc: { q: "Trotz ___ Regens gehen wir spazieren.", options: ["der", "den", "des", "dem"], correct: 2, explain: "trotz + Gen.; m → des + -s." },
      gap: { q: "Das ist das Buch ___ Lehrers. (озн., m, Gen.)", answer: "des" },
    },
    prevSlug: "dativ",
  }),

  // ============ WORTBILDUNG ============
  wortbildung: L({
    slug: "wortbildung", level: "B1", category: "Словотвір",
    titleDe: "Wortbildung", titleUk: "Словотвір: префікси, суфікси, складні слова",
    goal: "Розширювати словниковий запас через впізнавання частин слова.",
    explanation: [
      "<b>Складні слова</b> (Komposita) утворюються з двох і більше основ. Рід визначає <b>останнє</b> слово: <i>die Haus<b>tür</b></i> (die Tür), <i>der Apfel<b>saft</b></i> (der Saft).",
      "Поширені <b>суфікси іменників</b>: <b>-ung, -heit, -keit, -schaft, -tion</b> → die; <b>-er, -ismus</b> → der; <b>-chen, -lein</b> → das.",
      "Префікси прикметників <b>un-</b> (заперечення): unfreundlich, unmöglich. Префікси дієслів <b>ver-, be-, ent-</b> часто змінюють значення.",
    ],
    examples: [
      { de: "die Haustür = das Haus + die Tür", uk: "вхідні двері (рід — від «Tür»)" },
      { de: "die Arbeitslosigkeit", uk: "безробіття (Arbeit + los + igkeit)" },
      { de: "unfreundlich = un- + freundlich", uk: "недружній" },
    ],
    tip: "Якщо не знаєш складне слово — <b>розбий</b> його на частини й переклади з кінця.",
    mistakes: [
      { wrong: "der Haustür", right: "die Haustür (рід від Tür)" },
    ],
    exercises: {
      mc: { q: "Який артикль у «Apfelsaft»?", options: ["der", "die", "das", "—"], correct: 0, explain: "der Saft → der Apfelsaft." },
      gap: { q: "«Безробіття» німецькою (одне слово):", answer: "Arbeitslosigkeit" },
    },
  }),
};

export const getLesson = (slug?: string): LessonContent | undefined =>
  slug ? lessons[slug] : undefined;
