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
}

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

const makeQuestion = (word: VocabWord, pool: VocabWord[], kind: QuizKind, idx: number): QuizQuestion | null => {
  const base = stripArtikel(word.de);

  if (kind === "de-uk") {
    const d = pickDistinct(pool, 3, (w) => w.uk === word.uk).map((w) => w.uk);
    if (d.length < 2) return null;
    const { options, correctIndex } = buildOptions(word.uk, d);
    return { id: `q${idx}`, kind, prompt: `Що означає „${fullGerman(word)}“?`, options, correctIndex, word };
  }

  if (kind === "uk-de") {
    const d = pickDistinct(pool, 3, (w) => w.de === word.de).map((w) => fullGerman(w));
    if (d.length < 2) return null;
    const { options, correctIndex } = buildOptions(fullGerman(word), d);
    return { id: `q${idx}`, kind, prompt: `Як німецькою буде „${word.uk}“?`, options, correctIndex, word };
  }

  if (kind === "artikel") {
    if (!word.artikel) return null;
    const options = ["der", "die", "das"];
    return {
      id: `q${idx}`,
      kind,
      prompt: "Який правильний артикль?",
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
      prompt: "Яка правильна форма множини?",
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
  return { id: `q${idx}`, kind, prompt: "Обери правильне слово:", sub: `„${gapped}“`, options, correctIndex, word };
};

const KINDS: QuizKind[] = ["de-uk", "uk-de", "artikel", "plural", "context"];

export const buildQuiz = (sessionWords: VocabWord[], length = DEFAULT_QUIZ_LENGTH): QuizQuestion[] => {
  const pool = sessionWords;
  const candidates = shuffle(sessionWords);
  const questions: QuizQuestion[] = [];

  for (const word of candidates) {
    if (questions.length >= length) break;
    for (const kind of shuffle(KINDS)) {
      const q = makeQuestion(word, pool, kind, questions.length);
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

export const scoreQuiz = (answers: QuizAnswerRecord[]): QuizScore => {
  const total = answers.length;
  const correct = answers.filter((a) => a.correct).length;
  const percent = total ? Math.round((correct / total) * 100) : 0;
  const breakdown: { label: string; xp: number }[] = [
    { label: `${correct} правильних × ${XP.perCorrect} XP`, xp: correct * XP.perCorrect },
    { label: "Квіз завершено", xp: XP.completion },
  ];
  if (percent >= 80) breakdown.push({ label: "Бонус за 80%+", xp: XP.bonus80 });
  if (total > 0 && correct === total) breakdown.push({ label: "Ідеальний результат", xp: XP.bonusPerfect });
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
