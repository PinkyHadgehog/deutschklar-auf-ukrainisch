/**
 * Frontend-only store of vocabulary items that currently need review.
 *
 * A word enters the review list when answered wrong in a quiz session and
 * leaves it when answered correctly later. Distinct words only — repeating the
 * same mistake does not inflate the count.
 *
 * Future backend mapping: POST /api/vocabulary/review-items
 */

import { translate } from "@/i18n";

const KEY = "dk_vocab_review_items";
const RECENT_DAYS = 21;

export interface ReviewItem {
  word: string;
  at: string; // ISO of most recent mistake
}

type Store = Record<string, ReviewItem[]>; // topicId -> items

type Translator = (key: string, vars?: Record<string, string | number>) => string;

const listeners = new Set<() => void>();

export const subscribeVocabMistakes = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

const read = (): Store => {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? (parsed as Store) : {};
  } catch {
    return {};
  }
};

const write = (store: Store) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
};

const isRecent = (iso: string) =>
  Date.now() - new Date(iso).getTime() <= RECENT_DAYS * 24 * 60 * 60 * 1000;

/** Records one quiz session: wrong words are added, correct words are cleared. */
export const recordVocabSession = (topicId: string, wrongWords: string[], correctWords: string[] = []) => {
  const store = read();
  const now = new Date().toISOString();
  const current = store[topicId] ?? [];
  const map = new Map(current.map((i) => [i.word, i]));
  correctWords.forEach((w) => map.delete(w));
  wrongWords.forEach((w) => map.set(w, { word: w, at: now }));
  store[topicId] = Array.from(map.values()).filter((i) => isRecent(i.at));
  write(store);
};

/** Distinct vocabulary items that need review, per topic. */
export const getReviewItems = (topicId: string): ReviewItem[] =>
  (read()[topicId] ?? []).filter((i) => isRecent(i.at));

export const getReviewCounts = (): Record<string, number> => {
  const out: Record<string, number> = {};
  Object.entries(read()).forEach(([topic, items]) => {
    const n = items.filter((i) => isRecent(i.at)).length;
    if (n > 0) out[topic] = n;
  });
  return out;
};

// Ukrainian pluralisation rule for "слово/слова/слів"; the translated text
// for each bucket (incl. German) lives in the vocab dictionaries.
const reviewCountKey = (n: number): string => {
  const last = n % 10;
  const teen = n % 100 >= 11 && n % 100 <= 14;
  if (!teen && last === 1) return "vocab.review.count.one";
  if (!teen && last >= 2 && last <= 4) return "vocab.review.count.few";
  return "vocab.review.count.many";
};

/**
 * "3 слова варто повторити" / "5 слів варто повторити".
 * Accepts an optional translator so callers rendering in the current
 * interface language can pass `t` from `useLang()`; defaults to Ukrainian
 * for callers outside a React render (kept for backward compatibility).
 */
export const wordsToReviewLabel = (
  n: number,
  t: Translator = (key, vars) => translate(key, "uk", vars)
) => t(reviewCountKey(n), { n });
