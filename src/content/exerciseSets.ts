// Додаткові вправи (8 на урок) у зростаючому порядку складності.
// Базові 5 типів + розширення: match | multiSelect | correctSentence | writeFree.

export type ExerciseItem =
  | { type: "mc"; q: string; options: string[]; correct: number; explain?: string }
  | { type: "gap"; q: string; answer: string | string[]; hint?: string; explain?: string }
  | { type: "tf"; q: string; correct: boolean; explain?: string }
  | { type: "order"; prompt: string; words: string[]; correct: string[]; explain?: string }
  | { type: "translate"; prompt: string; uk: string; de: string | string[]; explain?: string }
  | { type: "match"; prompt: string; pairs: { left: string; right: string }[]; explain?: string }
  | { type: "multi"; q: string; options: string[]; correct: number[]; explain?: string }
  | { type: "correct"; prompt: string; wrong: string; correct: string | string[]; explain?: string }
  | { type: "writeFree"; prompt: string; sample: string; explain?: string };

const mc = (q: string, options: string[], correct: number, explain?: string): ExerciseItem =>
  ({ type: "mc", q, options, correct, explain });
const gap = (q: string, answer: string | string[], hint?: string, explain?: string): ExerciseItem =>
  ({ type: "gap", q, answer, hint, explain });
const tf = (q: string, correct: boolean, explain?: string): ExerciseItem =>
  ({ type: "tf", q, correct, explain });
const ord = (prompt: string, words: string[], correct: string[], explain?: string): ExerciseItem =>
  ({ type: "order", prompt, words, correct, explain });
const tr = (prompt: string, uk: string, de: string | string[], explain?: string): ExerciseItem =>
  ({ type: "translate", prompt, uk, de, explain });

// Утиліта для shuffled — щоб слова в order відображалися не у правильному порядку
const shuffle = (arr: string[]): string[] => {
  // детермінований розворот для стабільності UI
  return [...arr].reverse();
};

export const exerciseSets: Record<string, ExerciseItem[]> = {
  // ====== VERBEN — Огляд ======
  verben: [
    mc("Ich ___ Deutsch.", ["lerne", "lernst", "lernt", "lernen"], 0, "ich → -e."),
    mc("Wir ___ ins Kino.", ["gehe", "gehst", "geht", "gehen"], 3, "wir → -en."),
    gap("Du ___ Kaffee. (trinken)", "trinkst", "du → -st."),
    tf("«ihr macht» — це правильна форма дієслова machen у Präsens.", true),
    gap("Er ___ einen Bruder. (haben)", "hat", "er hat."),
    ord("Склади речення: «Я живу в Берліні».", shuffle(["Ich", "wohne", "in", "Berlin"]), ["Ich", "wohne", "in", "Berlin"]),
    tr("Перекладіть: «Вона розмовляє українською.»", "Вона розмовляє українською.", ["Sie spricht Ukrainisch."]),
    mc("Яке дієслово — сильне (з чергуванням голосної)?", ["machen", "lernen", "lesen", "kaufen"], 2, "lesen → du liest."),
  ],

  // ====== PRÄSENS (A1, повний 15-набір — еталонна лекція) ======
  praesens: [
    mc("Ich ___ jeden Tag Sport.", ["mache", "machst", "macht", "machen"], 0, "ich → -e."),
    mc("Sie (Pl.) ___ in München.", ["wohne", "wohnst", "wohnt", "wohnen"], 3, "wir/sie → -en."),
    gap("Du ___ Kaffee. (trinken)", "trinkst", "du → -st."),
    gap("Er ___ ein Buch. (lesen)", "liest", "e → ie у 3 особі однини."),
    tf("У Präsens 3 особі однини дієслово завжди має закінчення -t.", true),
    mc("Wann ___ ihr nach Hause?", ["kommen", "kommt", "kommst", "komme"], 1, "ihr → -t."),
    gap("Du ___ schnell. (laufen — au → äu)", "läufst"),
    { type: "correct", prompt: "Знайди помилку та запиши правильно:", wrong: "Du fahrst nach Berlin.",
      correct: ["Du fährst nach Berlin."], explain: "fahren → у 2 ос. одн. a → ä." },
    { type: "match", prompt: "Зістав займенник і форму дієслова «sprechen»:",
      pairs: [
        { left: "ich", right: "spreche" },
        { left: "du", right: "sprichst" },
        { left: "er", right: "spricht" },
        { left: "wir", right: "sprechen" },
      ]},
    ord("«Завтра я їду до Відня».", shuffle(["Morgen", "fahre", "ich", "nach", "Wien"]),
      ["Morgen", "fahre", "ich", "nach", "Wien"], "Дієслово — на 2 місці."),
    { type: "multi", q: "Виділи всі правильні форми Präsens (можна кілька):",
      options: ["ich bin", "du hast", "er sprecht", "wir gehen", "ihr seid"], correct: [0,1,3,4],
      explain: "«er sprecht» — неправильно: er spricht." },
    gap("Wir ___ heute Pizza. (essen)", "essen"),
    tr("Перекладіть: «Ти добре розмовляєш німецькою.»", "Ти добре розмовляєш німецькою.",
      ["Du sprichst gut Deutsch.", "Du sprichst sehr gut Deutsch."]),
    tr("Перекладіть німецькою: «Вона працює в Берліні.»", "Вона працює в Берліні.",
      ["Sie arbeitet in Berlin."], "Основа на -t → -e- перед закінченням."),
    { type: "writeFree", prompt: "Напиши 3 речення про свій типовий день у Präsens.",
      sample: "Ich stehe um 7 Uhr auf. Ich arbeite den ganzen Tag. Am Abend lese ich ein Buch.",
      explain: "Перевір: дієслово на 2 місці, закінчення відповідає особі." },
  ],

  // ====== PERFEKT ======
  perfekt: [
    mc("Ich ___ gestern viel gearbeitet.", ["bin", "habe", "war", "hatte"], 1, "arbeiten — не рух → haben."),
    mc("Wir ___ nach Italien gefahren.", ["haben", "sind", "waren", "hatten"], 1, "fahren — рух → sein."),
    gap("Sie hat ein Buch ___ . (lesen, Partizip II)", "gelesen"),
    gap("Er ist um 6 Uhr ___ . (aufstehen, P II)", "aufgestanden", "ge- між префіксом і основою."),
    tf("Дієслова на -ieren у Perfekt отримують префікс ge-.", false, "Ні: telefoniert, studiert — без ge-."),
    mc("Was ist richtig?", [
      "Ich habe nach Hause gegangen.",
      "Ich bin nach Hause gegangen.",
      "Ich war nach Hause gegangen.",
      "Ich gehe nach Hause gegangen.",
    ], 1),
    ord("«Учора я подивився фільм».", shuffle(["Gestern", "habe", "ich", "einen", "Film", "gesehen"]), ["Gestern", "habe", "ich", "einen", "Film", "gesehen"]),
    tr("Перекладіть у Perfekt: «Я навчилася німецької.»", "Я вивчила німецьку.", ["Ich habe Deutsch gelernt."]),
  ],

  // ====== PRÄTERITUM ======
  praeteritum: [
    mc("Als Kind ___ ich oft krank.", ["bin", "war", "habe", "hatte"], 1),
    gap("Wir ___ keine Zeit. (haben — Prät.)", "hatten"),
    mc("Er ___ schnell laufen.", ["kann", "konnte", "konnten", "könnte"], 1, "können — Prät. → konnte."),
    gap("Sie ___ ins Büro. (gehen — Prät., 3 Sg.)", "ging"),
    tf("В 1 і 3 особі однини Präteritum слабкі дієслова мають однакову форму.", true, "ich machte = er machte."),
    mc("Was ist Präteritum von «sein» (wir)?", ["waren", "wart", "war", "sind"], 0),
    ord("«Минулого року ми жили у Львові».", shuffle(["Letztes", "Jahr", "wohnten", "wir", "in", "Lwiw"]), ["Letztes", "Jahr", "wohnten", "wir", "in", "Lwiw"]),
    tr("Перекладіть у Präteritum: «Я мав багато роботи.»", "Я мав багато роботи.", ["Ich hatte viel Arbeit."]),
  ],

  // ====== FUTUR I ======
  futur1: [
    mc("Ich ___ morgen kommen.", ["werde", "wirst", "wird", "werden"], 0),
    mc("Du ___ es schaffen!", ["werde", "wirst", "wird", "werdet"], 1),
    gap("Es ___ bald regnen. (werden, 3 Sg.)", "wird"),
    tf("Futur I потребує допоміжного дієслова «werden» + Infinitiv.", true),
    gap("Wir ___ dich besuchen. (werden, 1 Pl.)", "werden"),
    mc("Що означає речення «Sie wird wohl zu Hause sein»?", [
      "Вона буде вдома (точно).",
      "Вона, мабуть, удома.",
      "Вона хоче бути вдома.",
      "Вона мусить бути вдома.",
    ], 1, "wohl + Futur I = припущення."),
    ord("«Я зателефоную тобі завтра».", shuffle(["Ich", "werde", "dich", "morgen", "anrufen"]), ["Ich", "werde", "dich", "morgen", "anrufen"]),
    tr("Перекладіть у Futur I: «Ми будемо вчити німецьку.»", "Ми будемо вчити німецьку.", ["Wir werden Deutsch lernen."]),
  ],

  // ====== MODALVERBEN ======
  modalverben: [
    mc("Ich ___ gut Deutsch sprechen.", ["kann", "muss", "darf", "will"], 0),
    mc("Hier ___ man nicht rauchen.", ["kann", "muss", "darf", "will"], 2, "заборона → nicht dürfen."),
    gap("Du ___ jetzt nach Hause gehen. (müssen)", "musst"),
    gap("Ich ___ einen Tee, bitte. (möchten)", "möchte"),
    tf("В 1 і 3 особі однини модальних дієслів немає закінчення.", true, "ich kann, er kann."),
    mc("«Du musst nicht kommen» означає:", [
      "Тобі заборонено приходити.",
      "Ти НЕ зобовʼязаний приходити.",
      "Ти не можеш прийти.",
      "Ти не хочеш прийти.",
    ], 1, "müssen + nicht = не обовʼязково."),
    ord("«Я хочу поїхати до Берліна».", shuffle(["Ich", "will", "nach", "Berlin", "fahren"]), ["Ich", "will", "nach", "Berlin", "fahren"]),
    tr("Перекладіть: «Чи можу я Вам допомогти?»", "Чи можу я Вам допомогти?", ["Kann ich Ihnen helfen?", "Darf ich Ihnen helfen?"]),
  ],

  // ====== TRENNBARE ======
  trennbare: [
    mc("Ich ___ um 7 Uhr ___ .", ["aufstehe / —", "stehe / auf", "stehe auf / —", "auf / stehe"], 1),
    gap("Wann ___ der Film an? (anfangen, 3 Sg.) — перша частина", "fängt"),
    mc("Bitte ___ die Tür ___ ! (zumachen)", ["zumach / —", "mach / zu", "mache zu / —", "zu / mache"], 1),
    gap("Er ___ heute früh ___ . (einkaufen) — друга частина (префікс)", "ein"),
    tf("У підрядному реченні префікс і дієслово знову зʼєднуються.", true, "…, weil ich aufstehe."),
    mc("Що з цього — НЕ відокремлюваний префікс?", ["auf-", "an-", "be-", "mit-"], 2, "be- невідокремлюваний."),
    ord("«Завтра я рано встаю».", shuffle(["Morgen", "stehe", "ich", "früh", "auf"]), ["Morgen", "stehe", "ich", "früh", "auf"]),
    tr("Перекладіть: «Я тобі завтра зателефоную.»", "Я тобі завтра зателефоную.", ["Ich rufe dich morgen an."]),
  ],

  // ====== UNTRENNBARE ======
  untrennbare: [
    mc("Ich ___ dich gut.", ["verstehe", "verstehst", "versteht", "verstehen"], 0),
    gap("Hast du die Rechnung ___ ? (bezahlen, P II)", "bezahlt", "без ge-."),
    mc("Was ist richtig?", [
      "Ich habe alles geverstanden.",
      "Ich habe alles verstanden.",
      "Ich habe alles verstand.",
      "Ich habe alles verstehen.",
    ], 1),
    gap("Er ___ eine Geschichte. (erzählen, 3 Sg.)", "erzählt"),
    tf("Префікс «ent-» — відокремлюваний.", false, "ent- невідокремлюваний."),
    mc("Який префікс НЕ відокремлюється?", ["ab-", "aus-", "ver-", "ein-"], 2),
    ord("«Я заплатив за каву».", shuffle(["Ich", "habe", "den", "Kaffee", "bezahlt"]), ["Ich", "habe", "den", "Kaffee", "bezahlt"]),
    tr("Перекладіть: «Ти мене розумієш?»", "Ти мене розумієш?", ["Verstehst du mich?"]),
  ],

  // ====== REFLEXIVE ======
  reflexive: [
    mc("Ich freue ___ auf das Wochenende.", ["mir", "mich", "sich", "dich"], 1),
    mc("Beeil ___ ! (du)", ["dir", "dich", "sich", "euch"], 1),
    gap("Wir interessieren ___ für Kunst.", "uns"),
    gap("Ich wasche ___ die Hände. (Dat.)", "mir", "є друге доповнення → Dativ."),
    tf("Дієслово «sich freuen» у 1 особі однини: «ich freue mir».", false, "Akk. → mich."),
    mc("Sie putzt ___ die Zähne.", ["sie", "ihr", "sich", "ihn"], 2, "Dat. → sich."),
    ord("«Я чекаю на тебе».", shuffle(["Ich", "freue", "mich", "auf", "dich"]), ["Ich", "freue", "mich", "auf", "dich"]),
    tr("Перекладіть: «Він цікавиться спортом.»", "Він цікавиться спортом.", ["Er interessiert sich für Sport."]),
  ],

  // ====== VERBEN MIT PRÄP. ======
  "verben-praep": [
    mc("Ich warte ___ den Bus.", ["für", "auf", "über", "an"], 1),
    mc("Sie denkt oft ___ ihre Eltern.", ["über", "auf", "an", "für"], 2),
    gap("Wir sprechen ___ die Prüfung. (über/von)", "über"),
    gap("Er hat Angst ___ Hunden.", "vor"),
    tf("«helfen» вживається з прийменником «für».", false, "helfen bei + Dat."),
    mc("___ wartest du? — Auf den Zug.", ["Wofür", "Worauf", "Woran", "Worüber"], 1, "warten auf → worauf."),
    ord("«Я цікавлюся історією».", shuffle(["Ich", "interessiere", "mich", "für", "Geschichte"]), ["Ich", "interessiere", "mich", "für", "Geschichte"]),
    tr("Перекладіть: «Я думаю про тебе».", "Я думаю про тебе.", ["Ich denke an dich."]),
  ],

  // ====== KONJUNKTIV II ======
  konjunktiv2: [
    mc("Ich ___ gern einen Kaffee.", ["habe", "hätte", "haben", "hätten"], 1),
    mc("Wenn ich du ___, würde ich gehen.", ["bin", "war", "wäre", "würde"], 2),
    gap("___ Sie mir bitte helfen? (können — K.II, Sie)", "Könnten"),
    gap("Wenn ich Zeit ___, würde ich reisen. (haben — K.II)", "hätte"),
    tf("Konjunktiv II «würde» вживається з усіма дієсловами, включаючи sein і haben.", false, "Для sein/haben/модальних — власні форми (wäre, hätte, könnte)."),
    mc("An deiner Stelle ___ ich das nicht machen.", ["werde", "würde", "wäre", "hätte"], 1, "порада."),
    ord("«Я б подорожував, якби в мене був час».", shuffle(["Ich", "würde", "reisen", ",", "wenn", "ich", "Zeit", "hätte"]), ["Ich", "würde", "reisen", ",", "wenn", "ich", "Zeit", "hätte"]),
    tr("Перекладіть: «Я б хотіла шматочок торта.»", "Я б хотіла шматочок торта.", ["Ich hätte gern ein Stück Kuchen.", "Ich möchte ein Stück Kuchen."]),
  ],

  // ====== PASSIV ======
  passiv: [
    mc("Das Auto ___ gerade repariert.", ["ist", "wird", "hat", "war"], 1),
    mc("Das Haus ___ 1990 gebaut.", ["wird", "wurde", "ist", "hat"], 1, "Präteritum Passiv → wurde."),
    gap("Der Brief wurde von Anna ___ . (schreiben, P II)", "geschrieben"),
    gap("Die Tür ist schon ___ . (schließen, P II) — Zustandspassiv", "geschlossen"),
    tf("У Perfekt Passiv замість «geworden» вживається «worden».", true),
    mc("Що означає «Das Haus ist gebaut»?", [
      "Будинок будується.",
      "Будинок збудовано (стан).",
      "Будинок збудують.",
      "Будинок будуть будувати.",
    ], 1, "Zustandspassiv = результат."),
    ord("«Лист написаний учора».", shuffle(["Der", "Brief", "wurde", "gestern", "geschrieben"]), ["Der", "Brief", "wurde", "gestern", "geschrieben"]),
    tr("Перекладіть: «Тут палять.» (пасив, безособово)", "Тут палять.", ["Hier wird geraucht."]),
  ],

  // ====== SUBSTANTIVE ======
  substantive: [
    mc("___ Information ist wichtig.", ["Der", "Die", "Das", "Den"], 1, "-tion → die."),
    mc("___ Mädchen spielt im Garten.", ["Der", "Die", "Das", "Den"], 2, "-chen → das."),
    gap("Артикль для «Wohnung»:", "die", "-ung → die."),
    gap("Множина «das Kind» — «die ___».", "Kinder"),
    tf("У множині артикль завжди «die», незалежно від роду в однині.", true),
    mc("Який артикль у «Tourismus»?", ["der", "die", "das", "—"], 0, "-ismus → der."),
    ord("«Маленька дівчинка читає книгу».", shuffle(["Das", "kleine", "Mädchen", "liest", "ein", "Buch"]), ["Das", "kleine", "Mädchen", "liest", "ein", "Buch"]),
    tr("Перекладіть: «Я маю двох братів і одну сестру».", "Я маю двох братів і одну сестру.", ["Ich habe zwei Brüder und eine Schwester."]),
  ],

  // ====== ARTIKEL ======
  artikel: [
    mc("Ich trinke ___ Kaffee. (один)", ["der", "den", "ein", "einen"], 3, "Akk. m → einen."),
    mc("___ Sonne scheint heute.", ["Der", "Die", "Das", "Eine"], 1, "die Sonne — єдина → озн."),
    gap("Sie hat ___ Schwester. (одну)", "eine"),
    gap("Заперечення: «Ich habe ___ Auto.»", "kein"),
    tf("Перед професіями у фразі «Er ist Lehrer» артикль НЕ ставиться.", true),
    mc("Який варіант правильний?", [
      "Ich bin ein Lehrer.",
      "Ich bin der Lehrer.",
      "Ich bin Lehrer.",
      "Ich bin einen Lehrer.",
    ], 2),
    ord("«У мене немає машини».", shuffle(["Ich", "habe", "kein", "Auto"]), ["Ich", "habe", "kein", "Auto"]),
    tr("Перекладіть: «Це моя сестра. Сестра — лікарка.»", "Це моя сестра. Сестра — лікарка.", ["Das ist meine Schwester. Die Schwester ist Ärztin."]),
  ],

  // ====== PRONOMEN ======
  pronomen: [
    mc("Ich sehe ___ jeden Tag. (його)", ["er", "ihn", "ihm", "sein"], 1),
    mc("Ich helfe ___ . (їй)", ["sie", "ihr", "ihre", "ihren"], 1, "helfen + Dat."),
    gap("Das ist ___ Bruder. (мій)", "mein"),
    gap("Das ist ___ Schwester. (моя)", "meine"),
    tf("Займенник «ihm» — це форма Dativ для «er» і «es».", true),
    mc("Ich gebe ___ das Buch. (тобі)", ["du", "dich", "dir", "dein"], 2),
    ord("«Я часто думаю про неї».", shuffle(["Ich", "denke", "oft", "an", "sie"]), ["Ich", "denke", "oft", "an", "sie"]),
    tr("Перекладіть: «Це його машина і його квартира.»", "Це його машина і його квартира.", ["Das ist sein Auto und seine Wohnung."]),
  ],

  // ====== ADJEKTIVE ======
  adjektive: [
    mc("Das Wetter ist ___ .", ["schöne", "schöner", "schön", "schönes"], 2, "після sein — без закінчення."),
    mc("Es ist ein ___ Tag. (Nom., m)", ["schön", "schöne", "schöner", "schönes"], 2),
    gap("Sie singt ___ . (schön — як прислівник)", "schön"),
    gap("Прикметник «alt» у формі прислівника:", "alt"),
    tf("Прикметник перед іменником завжди відмінюється.", true),
    mc("Das Auto ist ___ .", ["neue", "neuer", "neu", "neues"], 2),
    ord("«Це новий гарний будинок».", shuffle(["Das", "ist", "ein", "neues", "schönes", "Haus"]), ["Das", "ist", "ein", "neues", "schönes", "Haus"]),
    tr("Перекладіть: «Книга цікава».", "Книга цікава.", ["Das Buch ist interessant."]),
  ],

  // ====== ADJ.DEKL. NACH BEST.ART. (B1, повний 15-набір — еталонна лекція) ======
  "adjektivdeklination-bestimmter": [
    mc("Der ___ Hund bellt laut.", ["groß", "große", "großer", "großen"], 1, "Nom. m → -e."),
    mc("Ich sehe den ___ Mann.", ["nette", "netten", "nett", "nettem"], 1, "Akk. m → -en."),
    gap("Sie liest die ___ Zeitung. (interessant)", "interessante", "Akk. f → -e."),
    gap("Ich helfe dem ___ Kind. (klein)", "kleinen", "Dat. n → -en."),
    tf("У Plural після «die» прикметник завжди має закінчення -en.", true),
    mc("Das Auto des ___ Mannes ist neu.", ["jung", "junge", "jungen", "junger"], 2, "Gen. m → -en."),
    { type: "match", prompt: "Зістав відмінок із закінченням прикметника після «der/die/das»:",
      pairs: [
        { left: "Nom. m (der … Mann)", right: "-e" },
        { left: "Akk. m (den … Mann)", right: "-en" },
        { left: "Dat. f (der … Frau)", right: "-en" },
        { left: "Plural (die … Kinder)", right: "-en" },
      ]},
    { type: "correct", prompt: "Знайди помилку:",
      wrong: "Ich sehe den groß Mann.", correct: ["Ich sehe den großen Mann."],
      explain: "Akk. m після «den» → -en." },
    gap("Die ___ Studenten lernen viel. (fleißig)", "fleißigen", "Plural → -en."),
    { type: "multi", q: "Виділи всі правильні форми (можна кілька):",
      options: [
        "der kleine Hund (Nom.)",
        "die kleinen Kinder (Nom. Pl.)",
        "dem klein Kind (Dat.)",
        "des großen Mannes (Gen.)",
        "die schöne Blume (Nom. f)",
      ], correct: [0,1,3,4], explain: "«dem klein Kind» неправильно — має бути «dem kleinen Kind»." },
    ord("«Маленькі діти граються в парку».",
      shuffle(["Die", "kleinen", "Kinder", "spielen", "im", "Park"]),
      ["Die", "kleinen", "Kinder", "spielen", "im", "Park"]),
    tr("Перекладіть: «Я бачу гарну дівчину» (das Mädchen).",
      "Я бачу гарну дівчину.", ["Ich sehe das schöne Mädchen."]),
    tr("Перекладіть: «Молодий учитель допомагає старим людям.»",
      "Молодий учитель допомагає старим людям.",
      ["Der junge Lehrer hilft den alten Leuten.", "Der junge Lehrer hilft den alten Menschen."]),
    { type: "correct", prompt: "Виправ помилку у відмінюванні:",
      wrong: "Das ist das Auto des junge Mannes.",
      correct: ["Das ist das Auto des jungen Mannes."], explain: "Gen. m → -en." },
    { type: "writeFree",
      prompt: "Напиши 3 речення про свою родину, у кожному використай прикметник після означеного артикля.",
      sample: "Die nette Mutter kocht das Abendessen. Der kleine Bruder spielt im Garten. Ich helfe der alten Großmutter.",
      explain: "Слабка відмінa: Nom. одн. -e, всі інші — -en." },
  ],
};
