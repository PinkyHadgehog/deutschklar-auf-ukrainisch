// Додаткові вправи (8 на урок) у зростаючому порядку складності.
// 5 типів: mc | gap | tf | order | translate.

export type ExerciseItem =
  | { type: "mc"; q: string; options: string[]; correct: number; explain?: string }
  | { type: "gap"; q: string; answer: string | string[]; hint?: string }
  | { type: "tf"; q: string; correct: boolean; explain?: string }
  | { type: "order"; prompt: string; words: string[]; correct: string[] }
  | { type: "translate"; prompt: string; uk: string; de: string | string[] };

const mc = (q: string, options: string[], correct: number, explain?: string): ExerciseItem =>
  ({ type: "mc", q, options, correct, explain });
const gap = (q: string, answer: string | string[], hint?: string): ExerciseItem =>
  ({ type: "gap", q, answer, hint });
const tf = (q: string, correct: boolean, explain?: string): ExerciseItem =>
  ({ type: "tf", q, correct, explain });
const ord = (prompt: string, words: string[], correct: string[]): ExerciseItem =>
  ({ type: "order", prompt, words, correct });
const tr = (prompt: string, uk: string, de: string | string[]): ExerciseItem =>
  ({ type: "translate", prompt, uk, de });

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

  // ====== PRÄSENS ======
  praesens: [
    mc("Ich ___ jeden Tag Sport.", ["mache", "machst", "macht", "machen"], 0),
    gap("Du ___ schnell. (laufen — e/ä чергування: a→äu)", "läufst"),
    mc("Sie (Pl.) ___ in München.", ["wohne", "wohnst", "wohnt", "wohnen"], 3),
    tf("У Präsens 3 особі однини дієслово завжди має закінчення -t.", true),
    gap("Er ___ ein Buch. (lesen)", "liest", "e → ie."),
    mc("Wann ___ ihr nach Hause?", ["kommen", "kommt", "kommst", "komme"], 1, "ihr → -t."),
    ord("«Завтра я їду до Відня».", shuffle(["Morgen", "fahre", "ich", "nach", "Wien"]), ["Morgen", "fahre", "ich", "nach", "Wien"]),
    tr("Перекладіть: «Ти добре розмовляєш німецькою.»", "Ти добре розмовляєш німецькою.", ["Du sprichst gut Deutsch.", "Du sprichst sehr gut Deutsch."]),
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

  // ====== ADJ.DEKL. NACH BEST.ART. ======
  "adjektivdeklination-bestimmter": [
    mc("Der ___ Hund bellt laut.", ["groß", "große", "großer", "großen"], 1, "Nom. m → -e."),
    mc("Ich sehe den ___ Mann.", ["nette", "netten", "nett", "nettem"], 1, "Akk. m → -en."),
    gap("Sie liest die ___ Zeitung. (interessant)", "interessante", "Akk. f → -e."),
    gap("Ich helfe dem ___ Kind. (klein)", "kleinen", "Dat. n → -en."),
    tf("У Plural після «die» прикметник завжди має закінчення -en.", true),
    mc("Das Auto des ___ Mannes ist neu.", ["jung", "junge", "jungen", "junger"], 2, "Gen. m → -en."),
    ord("«Маленькі діти граються в парку».", shuffle(["Die", "kleinen", "Kinder", "spielen", "im", "Park"]), ["Die", "kleinen", "Kinder", "spielen", "im", "Park"]),
    tr("Перекладіть: «Я бачу гарну дівчину».", "Я бачу гарну дівчину.", ["Ich sehe das schöne Mädchen.", "Ich sehe die schöne Frau."]),
  ],

  // ====== KOMP. & SUPERL. ======
  "komparativ-superlativ": [
    mc("Berlin ist ___ als München.", ["groß", "größer", "am größten", "größere"], 1),
    mc("Im Sommer ist es ___ .", ["heiß", "heißer", "am heißesten", "heißeste"], 2),
    gap("Komparativ від «alt»:", "älter"),
    gap("Ich trinke am ___ Tee. (gern)", "liebsten"),
    tf("Прикметник «gut» у вищому ступені — «guter».", false, "gut → besser."),
    mc("Mein Bruder ist so alt ___ ich.", ["als", "wie", "wenn", "denn"], 1, "рівність → wie."),
    ord("«Це найкраща книга».", shuffle(["Das", "ist", "das", "beste", "Buch"]), ["Das", "ist", "das", "beste", "Buch"]),
    tr("Перекладіть: «Анна вища за Лізу».", "Анна вища за Лізу.", ["Anna ist größer als Lisa."]),
  ],

  // ====== ADJ. + PRÄP. ======
  "adjektive-praep": [
    mc("Sie ist zufrieden ___ der Note.", ["mit", "auf", "für", "über"], 0),
    mc("Ich bin stolz ___ meine Familie.", ["für", "auf", "über", "an"], 1),
    gap("Er ist verliebt ___ sie. (Präp.)", "in"),
    gap("Das ist abhängig ___ Wetter. (von dem = …)", "vom"),
    tf("«bekannt» вживається з прийменником «für».", true),
    mc("Bist du bereit ___ Prüfung?", ["zu", "zur", "für", "auf"], 1, "bereit zu + Dat.; zu + der = zur."),
    ord("«Ми задоволені готелем».", shuffle(["Wir", "sind", "mit", "dem", "Hotel", "zufrieden"]), ["Wir", "sind", "mit", "dem", "Hotel", "zufrieden"]),
    tr("Перекладіть: «Я пишаюся своєю донькою».", "Я пишаюся своєю донькою.", ["Ich bin stolz auf meine Tochter."]),
  ],

  // ====== PARTIZIPIEN ======
  partizipien: [
    mc("Partizip I від «lachen»:", ["gelacht", "lachend", "lacht", "lachen"], 1),
    mc("Partizip II від «kochen»:", ["kochend", "kochte", "gekocht", "kocht"], 2),
    gap("der ___ Brief (geschrieben, m, Nom.)", "geschriebene"),
    gap("das ___ Kind (lachen → P I, n, Nom.)", "lachende"),
    tf("Partizip II як прикметник означає завершену або пасивну дію.", true),
    mc("Що з цього — Partizip I як прикметник?", [
      "der gekochte Reis",
      "der laufende Motor",
      "das gelesene Buch",
      "die geschriebene SMS",
    ], 1),
    ord("«Я бачу дитину, що спить».", shuffle(["Ich", "sehe", "ein", "schlafendes", "Kind"]), ["Ich", "sehe", "ein", "schlafendes", "Kind"]),
    tr("Перекладіть: «Зварений рис смачний».", "Зварений рис смачний.", ["Der gekochte Reis schmeckt gut."]),
  ],

  // ====== ADVERBIEN ======
  adverbien: [
    mc("Який порядок правильний?", [
      "Ich gehe ins Kino heute mit Anna.",
      "Ich gehe heute mit Anna ins Kino.",
      "Heute ich gehe mit Anna ins Kino.",
      "Ich heute gehe mit Anna ins Kino.",
    ], 1, "Te → Mo → Lo."),
    mc("«leider» — це прислівник…", ["часу", "місця", "способу", "причини"], 2),
    gap("Прислівник «тут» німецькою:", "hier"),
    gap("Прислівник «часто» німецькою:", "oft"),
    tf("У реченні «Morgen fahre ich nach Berlin» порядок слів правильний.", true, "Інверсія: на 1 місці обставина, дієслово на 2."),
    mc("Що з цього — прислівник причини?", ["heute", "dort", "schnell", "deshalb"], 3),
    ord("«Сьогодні я швидко їду додому».", shuffle(["Heute", "fahre", "ich", "schnell", "nach", "Hause"]), ["Heute", "fahre", "ich", "schnell", "nach", "Hause"]),
    tr("Перекладіть: «На жаль, я не маю часу».", "На жаль, я не маю часу.", ["Leider habe ich keine Zeit."]),
  ],

  // ====== PRÄPOSITIONEN ======
  praepositionen: [
    mc("Ich gehe ___ Schule. (куди → Akk.)", ["in der", "in die", "zur", "nach"], 1),
    mc("Das Buch liegt ___ Tisch. (де → Dat.)", ["auf den", "auf dem", "an dem", "in den"], 1),
    gap("Wir fahren ___ Bus. (mit + Dat., m)", "mit dem"),
    gap("Скорочення «in das» = ?", "ins"),
    tf("Прийменник «für» керує Dativ.", false, "für + Akk."),
    mc("___ des Regens bleiben wir zu Hause.", ["Trotz", "Mit", "Bei", "Während"], 0, "trotz + Gen."),
    ord("«Я їду на роботу автобусом».", shuffle(["Ich", "fahre", "mit", "dem", "Bus", "zur", "Arbeit"]), ["Ich", "fahre", "mit", "dem", "Bus", "zur", "Arbeit"]),
    tr("Перекладіть: «Картина висить на стіні».", "Картина висить на стіні.", ["Das Bild hängt an der Wand."]),
  ],

  // ====== KONJUNKTIONEN ======
  konjunktionen: [
    mc("Ich komme nicht, ___ ich krank bin.", ["denn", "weil", "deshalb", "aber"], 1, "Дієслово в кінці → weil."),
    mc("Es regnet, ___ bleibe ich zu Hause.", ["weil", "denn", "deshalb", "obwohl"], 2, "Інверсія → deshalb."),
    gap("Ich weiß, ___ du müde bist. (що)", "dass"),
    gap("___ es regnet, gehe ich nicht raus. (якщо)", "Wenn"),
    tf("«denn» і «weil» мають однакове значення «бо», але різний порядок слів.", true),
    mc("Що тут правильно?", [
      "…, obwohl er ist müde.",
      "…, obwohl müde er ist.",
      "…, obwohl er müde ist.",
      "…, obwohl ist er müde.",
    ], 2),
    ord("«Я залишаюсь удома, бо йде дощ».", shuffle(["Ich", "bleibe", "zu", "Hause", ",", "weil", "es", "regnet"]), ["Ich", "bleibe", "zu", "Hause", ",", "weil", "es", "regnet"]),
    tr("Перекладіть: «Я не знаю, чи він прийде».", "Я не знаю, чи він прийде.", ["Ich weiß nicht, ob er kommt."]),
  ],

  // ====== SATZBAU ======
  satzbau: [
    mc("Який порядок правильний?", [
      "Heute ich gehe ins Kino.",
      "Heute gehe ich ins Kino.",
      "Gehe heute ich ins Kino.",
      "Ich heute gehe ins Kino.",
    ], 1),
    mc("Питання без питального слова — дієслово на якому місці?", ["1", "2", "3", "в кінці"], 0),
    gap("Постав дієслово: «Morgen ___ ich nach Wien.» (fahren, 1 Sg.)", "fahre"),
    gap("Підрядне: «…, weil ich müde ___.» (sein, 1 Sg.)", "bin"),
    tf("У головному реченні дієслово завжди на 2 місці.", true),
    mc("Де стоїть Partizip II у Perfekt?", ["на 1 місці", "на 2 місці", "в кінці речення", "перед підметом"], 2),
    ord("«Я знаю, що ти втомлений».", shuffle(["Ich", "weiß", ",", "dass", "du", "müde", "bist"]), ["Ich", "weiß", ",", "dass", "du", "müde", "bist"]),
    tr("Перекладіть: «Завтра я мушу рано встати».", "Завтра я мушу рано встати.", ["Morgen muss ich früh aufstehen."]),
  ],

  // ====== ZEITEN ======
  zeiten: [
    mc("Який це час: «Ich hatte schon gegessen»?", ["Perfekt", "Präteritum", "Plusquamperfekt", "Futur II"], 2),
    mc("Який час типовий для усного мовлення?", ["Perfekt", "Präteritum", "Plusquamperfekt", "Futur II"], 0),
    gap("Допоміжне дієслово у «Ich ___ gefahren» (Perfekt, 1 Sg.):", "bin"),
    gap("Plusquamperfekt: «Sie ___ schon gegangen.» (sein, 3 Sg.)", "war"),
    tf("Plusquamperfekt описує дію, що відбулась РАНІШЕ за іншу минулу дію.", true),
    mc("Що це за час: «Bis morgen werde ich alles erledigt haben»?", ["Futur I", "Futur II", "Perfekt", "Plusquamperfekt"], 1),
    ord("«Поївши, я пішов гуляти».", shuffle(["Nachdem", "ich", "gegessen", "hatte", ",", "ging", "ich", "spazieren"]), ["Nachdem", "ich", "gegessen", "hatte", ",", "ging", "ich", "spazieren"]),
    tr("Перекладіть у Perfekt: «Ми поїхали до Берліна».", "Ми поїхали до Берліна.", ["Wir sind nach Berlin gefahren."]),
  ],

  // ====== NOMINATIV ======
  nominativ: [
    mc("___ Mann arbeitet.", ["Der", "Den", "Dem", "Des"], 0),
    mc("Das ist ___ Schwester.", ["mein", "meine", "meinen", "meiner"], 1),
    gap("«Це мій брат» — Das ist ___ Bruder.", "mein"),
    gap("«Це його дружина» — Das ist ___ Frau.", "seine"),
    tf("Після sein/werden другий іменник стоїть у Nominativ.", true),
    mc("Що правильно?", [
      "Er ist einen Lehrer.",
      "Er ist ein Lehrer.",
      "Er ist einem Lehrer.",
      "Er ist eines Lehrers.",
    ], 1),
    ord("«Моя сестра — лікарка».", shuffle(["Meine", "Schwester", "ist", "Ärztin"]), ["Meine", "Schwester", "ist", "Ärztin"]),
    tr("Перекладіть: «Жінку звати Марія».", "Жінку звати Марія.", ["Die Frau heißt Maria."]),
  ],

  // ====== AKKUSATIV ======
  akkusativ: [
    mc("Ich kaufe ___ Apfel.", ["ein", "einen", "einem", "eines"], 1),
    mc("Wir sehen ___ Film.", ["der", "den", "dem", "des"], 1),
    gap("Ich brauche ___ Stift. (неозн., m)", "einen"),
    gap("Прийменник «für» керує: «für ___ Freund» (мого друга, m)", "meinen"),
    tf("Тільки чоловічий рід змінюється в Akkusativ.", true),
    mc("Що правильно?", [
      "Ich gehe ohne du.",
      "Ich gehe ohne dir.",
      "Ich gehe ohne dich.",
      "Ich gehe ohne dein.",
    ], 2, "ohne + Akk."),
    ord("«Я купую яблуко й хліб».", shuffle(["Ich", "kaufe", "einen", "Apfel", "und", "ein", "Brot"]), ["Ich", "kaufe", "einen", "Apfel", "und", "ein", "Brot"]),
    tr("Перекладіть: «Я бачу нову машину».", "Я бачу нову машину.", ["Ich sehe ein neues Auto."]),
  ],

  // ====== DATIV ======
  dativ: [
    mc("Ich danke ___ Lehrer.", ["der", "den", "dem", "des"], 2),
    mc("Wir fahren mit ___ Kindern.", ["die", "der", "den", "dem"], 2, "Plural Dat. → den + -n."),
    gap("Ich helfe ___ Frau. (озн., f)", "der"),
    gap("Das Buch gehört ___ Kind. (озн., n)", "dem"),
    tf("Дієслово «helfen» керує Akkusativ.", false, "helfen + Dat."),
    mc("Що правильно?", [
      "mit den Kinder",
      "mit den Kindern",
      "mit der Kindern",
      "mit dem Kinder",
    ], 1),
    ord("«Я допомагаю своїй мамі».", shuffle(["Ich", "helfe", "meiner", "Mutter"]), ["Ich", "helfe", "meiner", "Mutter"]),
    tr("Перекладіть: «Машина належить моєму братові».", "Машина належить моєму братові.", ["Das Auto gehört meinem Bruder."]),
  ],

  // ====== GENITIV ======
  genitiv: [
    mc("Trotz ___ Regens gehen wir spazieren.", ["der", "den", "des", "dem"], 2),
    mc("Das ist das Auto ___ Bruders.", ["mein", "meinen", "meines", "meinem"], 2),
    gap("Während ___ Pause trinke ich Kaffee. (озн., f, Gen.)", "der"),
    gap("Закінчення іменника «Mann» у Gen.: des Mann___", "es"),
    tf("Прийменник «wegen» у літературній мові керує Genitiv.", true),
    mc("Що правильно?", [
      "das Auto mein Bruder",
      "das Auto meines Bruders",
      "das Auto meinem Bruder",
      "das Auto meinen Bruder",
    ], 1),
    ord("«Це машина мого батька».", shuffle(["Das", "ist", "das", "Auto", "meines", "Vaters"]), ["Das", "ist", "das", "Auto", "meines", "Vaters"]),
    tr("Перекладіть: «Через дощ ми залишаємось удома».", "Через дощ ми залишаємось удома.", ["Wegen des Regens bleiben wir zu Hause."]),
  ],

  // ====== WORTBILDUNG ======
  wortbildung: [
    mc("Який артикль у «Apfelsaft»?", ["der", "die", "das", "—"], 0, "der Saft."),
    mc("Який артикль у «Haustür»?", ["der", "die", "das", "—"], 1, "die Tür."),
    gap("«не дружній» — un + freundlich = ?", "unfreundlich"),
    gap("«безробіття» одним словом:", "Arbeitslosigkeit"),
    tf("У складному слові рід визначає ПЕРШЕ слово.", false, "Рід визначає ОСТАННЄ слово."),
    mc("Суфікс «-ung» дає рід:", ["der", "die", "das", "залежить"], 1),
    ord("«У мене є проїзний на залізницю».", shuffle(["Ich", "habe", "eine", "Bahnkarte"]), ["Ich", "habe", "eine", "Bahnkarte"]),
    tr("Перекладіть: «дитячий садок» (одне слово):", "дитячий садок", ["Kindergarten", "der Kindergarten"]),
  ],
};
