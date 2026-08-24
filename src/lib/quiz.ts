import type { VocabWord } from "@/data/mock";

/**
 * Frontend-only quiz engine.
 * Designed so the data source can later be swapped for REST endpoints:
 *   GET  /api/vocabulary/topics/{topicId}  -> VocabWord[]
 *   POST /api/quiz/answer                  -> submitAnswer()
 *   POST /api/progress                     -> saveProgress()
 * No backend calls are made for now.
 */

export type QuizKind = "de-uk" | "uk-de" | "artikel" | "plural" | "context";

export type Translator = (key: string, vars?: Record<string, string | number>) => string;

export interface QuizQuestion {
  id: string;
  kind: QuizKind;
  prompt: string;
  sub?: string;
  options: string[];
  correctIndex: number;
  word: VocabWord;
}

export interface QuizAnswerRecord {
  questionId: string;
  word: VocabWord;
  correct: boolean;
  kind?: QuizKind;
  userAnswer?: string;
  correctAnswer?: string;
}

export interface MistakeGroup {
  key: QuizKind;
  labelKey: string;
  hintKey: string;
  count: number;
}

const KIND_META: Record<QuizKind, { labelKey: string; hintKey: string; shortKey: string }> = {
  artikel: {
    labelKey: "vocab.quizKind.artikel.label",
    hintKey: "vocab.quizKind.artikel.hint",
    shortKey: "vocab.quizKind.artikel.short",
  },
  "de-uk": {
    labelKey: "vocab.quizKind.deUk.label",
    hintKey: "vocab.quizKind.deUk.hint",
    shortKey: "vocab.quizKind.deUk.short",
  },
  "uk-de": {
    labelKey: "vocab.quizKind.ukDe.label",
    hintKey: "vocab.quizKind.ukDe.hint",
    shortKey: "vocab.quizKind.ukDe.short",
  },
  plural: {
    labelKey: "vocab.quizKind.plural.label",
    hintKey: "vocab.quizKind.plural.hint",
    shortKey: "vocab.quizKind.plural.short",
  },
  context: {
    labelKey: "vocab.quizKind.context.label",
    hintKey: "vocab.quizKind.context.hint",
    shortKey: "vocab.quizKind.context.short",
  },
};

export const groupMistakes = (answers: QuizAnswerRecord[]): MistakeGroup[] => {
  const counts = new Map<QuizKind, number>();
  answers
    .filter((a) => !a.correct)
    .forEach((a) => {
      const k = (a.kind ?? "de-uk") as QuizKind;
      counts.set(k, (counts.get(k) ?? 0) + 1);
    });
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => ({
      key,
      count,
      labelKey: KIND_META[key].labelKey,
      hintKey: KIND_META[key].hintKey,
    }));
};

// Ukrainian pluralisation rule for "помилка/помилки/помилок"; the translated
// text for each bucket lives in the vocab dictionaries.
const mistakeCountKey = (n: number): string => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "vocab.mistake.count.one";
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return "vocab.mistake.count.few";
  return "vocab.mistake.count.many";
};

export const mistakeCountLabel = (n: number, t: Translator) => t(mistakeCountKey(n), { n });

export const focusMessage = (groups: MistakeGroup[], t: Translator): string => {
  if (groups.length === 0) return "";
  const top = groups.slice(0, 2).map((g) => t(KIND_META[g.key].shortKey));
  const joined = top.length === 2 ? `${top[0]}${t("vocab.quiz.focusJoin")}${top[1]}` : top[0];
  const capitalized = `${joined.charAt(0).toUpperCase()}${joined.slice(1)}`;
  return t("vocab.quiz.focusMessage", { topics: capitalized });
};

export const XP = {
  perCorrect: 1,
  bonus80: 3,
  bonusPerfect: 5,
};

export const DEFAULT_SESSION_SIZE = 20;
export const DEFAULT_QUIZ_LENGTH = 20;

export const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const stripArtikel = (de: string) => de.replace(/^\s*(der|die|das)\s+/i, "").trim();

export const fullGerman = (w: VocabWord) =>
  w.artikel ? `${w.artikel} ${stripArtikel(w.de)}` : stripArtikel(w.de);

const hasPlural = (w: VocabWord) => !!w.plural && !["—", "-", "", "–"].includes(w.plural.trim());

const pickDistinct = <T,>(pool: T[], count: number, exclude: (v: T) => boolean): T[] =>
  shuffle(pool.filter((v) => !exclude(v))).slice(0, count);

const buildOptions = (correct: string, distractors: string[]): { options: string[]; correctIndex: number } => {
  const uniq = Array.from(new Set(distractors.filter((d) => d && d !== correct)));
  const options = shuffle([correct, ...uniq]);
  return { options, correctIndex: options.indexOf(correct) };
};

const makeQuestion = (
  word: VocabWord,
  pool: VocabWord[],
  kind: QuizKind,
  idx: number,
  t: Translator
): QuizQuestion | null => {
  const base = stripArtikel(word.de);

  if (kind === "de-uk") {
    const d = pickDistinct(pool, 3, (w) => w.uk === word.uk).map((w) => w.uk);
    if (d.length < 2) return null;
    const { options, correctIndex } = buildOptions(word.uk, d);
    return {
      id: `q${idx}`,
      kind,
      prompt: t("vocab.quiz.prompt.meaning", { word: fullGerman(word) }),
      options,
      correctIndex,
      word,
    };
  }

  if (kind === "uk-de") {
    const d = pickDistinct(pool, 3, (w) => w.de === word.de).map((w) => fullGerman(w));
    if (d.length < 2) return null;
    const { options, correctIndex } = buildOptions(fullGerman(word), d);
    return {
      id: `q${idx}`,
      kind,
      prompt: t("vocab.quiz.prompt.translate", { word: word.uk }),
      options,
      correctIndex,
      word,
    };
  }

  if (kind === "artikel") {
    if (!word.artikel) return null;
    const options = ["der", "die", "das"];
    return {
      id: `q${idx}`,
      kind,
      prompt: t("vocab.quiz.prompt.artikel"),
      sub: `___ ${base}`,
      options,
      correctIndex: options.indexOf(word.artikel),
      word,
    };
  }

  if (kind === "plural") {
    if (!hasPlural(word)) return null;
    const correct = `die ${stripArtikel(word.plural!)}`;
    const raw = [
      `die ${base}s`,
      `die ${base}`,
      ...pickDistinct(pool, 3, (w) => !hasPlural(w) || w.de === word.de).map((w) => `die ${stripArtikel(w.plural!)}`),
    ];
    const distractors = Array.from(new Set(raw.filter((o) => o !== correct))).slice(0, 3);
    if (distractors.length < 2) return null;
    const { options, correctIndex } = buildOptions(correct, distractors);
    return {
      id: `q${idx}`,
      kind,
      prompt: t("vocab.quiz.prompt.plural"),
      sub: `${fullGerman(word)} →`,
      options,
      correctIndex,
      word,
    };
  }

  // context
  if (!word.sample || !word.sample.includes(base)) return null;
  const gapped = word.sample.replace(base, "____");
  const d = pickDistinct(pool, 3, (w) => stripArtikel(w.de) === base).map((w) => stripArtikel(w.de));
  if (d.length < 2) return null;
  const { options, correctIndex } = buildOptions(base, d);
  return {
    id: `q${idx}`,
    kind,
    prompt: t("vocab.quiz.prompt.context"),
    sub: `„${gapped}“`,
    options,
    correctIndex,
    word,
  };
};

const KINDS: QuizKind[] = ["de-uk", "uk-de", "artikel", "plural", "context"];

export const buildQuiz = (
  sessionWords: VocabWord[],
  t: Translator,
  length = DEFAULT_QUIZ_LENGTH
): QuizQuestion[] => {
  const pool = sessionWords;
  const candidates = shuffle(sessionWords);
  const questions: QuizQuestion[] = [];

  for (const word of candidates) {
    if (questions.length >= length) break;
    for (const kind of shuffle(KINDS)) {
      const q = makeQuestion(word, pool, kind, questions.length, t);
      if (q) {
        questions.push(q);
        break;
      }
    }
  }
  return questions;
};

export interface QuizScore {
  correct: number;
  total: number;
  percent: number;
  xp: number;
  breakdown: { label: string; xp: number }[];
}

export const scoreQuiz = (answers: QuizAnswerRecord[], t: Translator, isRepeat = false): QuizScore => {
  const total = answers.length;
  const correct = answers.filter((a) => a.correct).length;
  const percent = total ? Math.round((correct / total) * 100) : 0;
  if (isRepeat) {
    return {
      correct,
      total,
      percent,
      xp: 0,
      breakdown: [{ label: t("vocab.quiz.xp.repeatMode"), xp: 0 }],
    };
  }
  const breakdown: { label: string; xp: number }[] = [
    { label: t("vocab.quiz.xp.correctAnswers"), xp: correct * XP.perCorrect },
  ];
  if (percent >= 80) breakdown.push({ label: t("vocab.quiz.xp.bonus80"), xp: XP.bonus80 });
  if (total > 0 && correct === total) breakdown.push({ label: t("vocab.quiz.xp.bonusPerfect"), xp: XP.bonusPerfect });
  return { correct, total, percent, xp: breakdown.reduce((s, b) => s + b.xp, 0), breakdown };
};

/** Placeholder for POST /api/quiz/answer */
export const submitAnswer = async (_payload: { questionId: string; correct: boolean }) => {
  return { ok: true };
};

/** Placeholder for POST /api/progress */
export const saveProgress = async (_payload: { topicId: string; xp: number; wrongWords: string[] }) => {
  return { ok: true };
};
