/**
 * Shared helpers for the saved vocabulary library (Profile → Збережене → Слова).
 * Frontend-only: works on the existing savedItems store + vocab themes.
 */

import type { SavedItem } from "@/lib/savedItems";
import { vocabThemes } from "@/data/mock";

export interface SavedWordGroup {
  topicId: string;
  title: string;
  emoji: string;
  level?: string;
  words: SavedItem[];
  /** newest savedAt inside the group */
  lastSavedAt: number;
}

const str = (v: unknown) => (typeof v === "string" ? v : undefined);

export const savedWordTopicId = (w: SavedItem) =>
  str(w.meta?.theme) ?? w.id.split(":")[0] ?? "other";

export const savedWordDe = (w: SavedItem) =>
  str(w.meta?.de) ?? w.id.split(":").slice(1).join(":");

export const topicTitle = (id: string) =>
  vocabThemes.find((t) => t.id === id)?.titleDe ?? id;

export const topicEmoji = (id: string) =>
  vocabThemes.find((t) => t.id === id)?.emoji ?? "📚";

/** Case-insensitive match on German word, translation, plural and topic name. */
export const matchesSavedWordQuery = (w: SavedItem, query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const topicId = savedWordTopicId(w);
  const haystack = [
    savedWordDe(w),
    str(w.meta?.artikel),
    str(w.meta?.uk),
    str(w.meta?.plural),
    topicId,
    topicTitle(topicId),
    vocabThemes.find((t) => t.id === topicId)?.title,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
};

export const filterSavedWords = (words: SavedItem[], query: string, level: string) =>
  words.filter(
    (w) => (level === "all" || str(w.meta?.level) === level) && matchesSavedWordQuery(w, query)
  );

/** Single reusable grouping helper: group by topic, sorted by most recent savedAt. */
export const groupSavedWordsByTopic = (words: SavedItem[]): SavedWordGroup[] => {
  const map = new Map<string, SavedItem[]>();
  words.forEach((w) => {
    const topicId = savedWordTopicId(w);
    if (!map.has(topicId)) map.set(topicId, []);
    map.get(topicId)!.push(w);
  });

  return [...map.entries()]
    .map(([topicId, items]) => {
      const sorted = [...items].sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0));
      return {
        topicId,
        title: topicTitle(topicId),
        emoji: topicEmoji(topicId),
        level: str(sorted[0]?.meta?.level),
        words: sorted,
        lastSavedAt: sorted[0]?.savedAt ?? 0,
      };
    })
    .sort((a, b) => b.lastSavedAt - a.lastSavedAt || a.title.localeCompare(b.title));
};

/** Plural form for "saved word" count. Ukrainian by default, German when `lang === "de"`. */
export const wordCountLabel = (n: number, lang: "uk" | "de" = "uk") => {
  if (lang === "de") return n === 1 ? `${n} gespeichertes Wort` : `${n} gespeicherte Wörter`;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} збережене слово`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} збережених слова`;
  return `${n} збережених слів`;
};

export const topicCountLabel = (n: number, lang: "uk" | "de" = "uk") => {
  if (lang === "de") return n === 1 ? `${n} Thema` : `${n} Themen`;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} темі`;
  return `${n} темах`;
};

export const savedWordsLabel = (n: number, lang: "uk" | "de" = "uk") => {
  if (lang === "de") return n === 1 ? `${n} Wort` : `${n} Wörter`;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} слово`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} слова`;
  return `${n} слів`;
};
