/**
 * Shared frontend-only "Збережене" (saved library) store.
 *
 * Single source of truth for every heart / bookmark in the app.
 * Later this maps 1:1 to a Python backend:
 *   GET    /api/saved
 *   POST   /api/saved                 { type, id, meta }
 *   DELETE /api/saved/{type}/{id}
 */

import { useEffect, useState } from "react";

export type SavedType = "word" | "lesson" | "topic";

export interface SavedItem {
  id: string;
  type: SavedType;
  savedAt: number;
  /** Denormalised display data so the profile can render without extra lookups. */
  meta?: Record<string, string | number | undefined>;
}

export interface SavedItems {
  words: SavedItem[];
  lessons: SavedItem[];
  topics: SavedItem[];
}

const KEY = "dk_saved_items";
const listeners = new Set<() => void>();

const bucket = (type: SavedType): keyof SavedItems =>
  type === "word" ? "words" : type === "lesson" ? "lessons" : "topics";

const empty = (): SavedItems => ({ words: [], lessons: [], topics: [] });

const read = (): SavedItems => {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== "object") return empty();
    return {
      words: Array.isArray(parsed.words) ? parsed.words : [],
      lessons: Array.isArray(parsed.lessons) ? parsed.lessons : [],
      topics: Array.isArray(parsed.topics) ? parsed.topics : [],
    };
  } catch {
    return empty();
  }
};

const write = (next: SavedItems) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
};

const sorted = (items: SavedItem[]) => [...items].sort((a, b) => b.savedAt - a.savedAt);

/** Snapshot, newest first. */
export const getSavedItems = (): SavedItems => {
  const all = read();
  return {
    words: sorted(all.words),
    lessons: sorted(all.lessons),
    topics: sorted(all.topics),
  };
};

export const isSaved = (type: SavedType, id: string): boolean =>
  read()[bucket(type)].some((i) => i.id === id);

export const saveItem = (type: SavedType, id: string, meta?: SavedItem["meta"]) => {
  const all = read();
  const key = bucket(type);
  if (all[key].some((i) => i.id === id)) return;
  write({ ...all, [key]: [{ id, type, savedAt: Date.now(), meta }, ...all[key]] });
};

export const removeSavedItem = (type: SavedType, id: string) => {
  const all = read();
  const key = bucket(type);
  write({ ...all, [key]: all[key].filter((i) => i.id !== id) });
};

/** Returns the new saved state. */
export const toggleSavedItem = (type: SavedType, id: string, meta?: SavedItem["meta"]): boolean => {
  if (isSaved(type, id)) {
    removeSavedItem(type, id);
    return false;
  }
  saveItem(type, id, meta);
  return true;
};

export const subscribeSavedItems = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

/** Stable id for a vocabulary word. */
export const wordId = (theme: string, de: string) => `${theme}:${de}`;

/** Reactive snapshot of the whole saved library. */
export const useSavedItems = (): SavedItems => {
  const [state, setState] = useState<SavedItems>(() => getSavedItems());
  useEffect(() => {
    setState(getSavedItems());
    return subscribeSavedItems(() => setState(getSavedItems()));
  }, []);
  return state;
};

/** Reactive boolean for a single item. */
export const useIsSaved = (type: SavedType, id: string): boolean => {
  const [state, setState] = useState(() => isSaved(type, id));
  useEffect(() => {
    setState(isSaved(type, id));
    return subscribeSavedItems(() => setState(isSaved(type, id)));
  }, [type, id]);
  return state;
};
