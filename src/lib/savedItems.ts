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

const KEY = "deutschklar_saved_items";
/** Older builds used this key — migrated once on first read. */
const LEGACY_KEY = "dk_saved_items";
const listeners = new Set<() => void>();

const bucket = (type: SavedType): keyof SavedItems =>
  type === "word" ? "words" : type === "lesson" ? "lessons" : "topics";

const empty = (): SavedItems => ({ words: [], lessons: [], topics: [] });

const sanitize = (items: unknown, type: SavedType): SavedItem[] =>
  Array.isArray(items)
    ? items
        .filter((i): i is SavedItem => !!i && typeof i === "object" && typeof (i as SavedItem).id === "string")
        .map((i) => ({
          id: i.id,
          type: i.type ?? type,
          savedAt: typeof i.savedAt === "number" ? i.savedAt : Date.now(),
          meta: i.meta,
        }))
    : [];

/** Tolerant parse: partial objects keep whatever buckets they do have. */
const parse = (raw: string | null): SavedItems | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return {
      words: sanitize(parsed.words, "word"),
      lessons: sanitize(parsed.lessons, "lesson"),
      topics: sanitize(parsed.topics, "topic"),
    };
  } catch {
    return null;
  }
};

/** In-memory cache, hydrated from localStorage on first access. */
let cache: SavedItems | null = null;

const hydrate = (): SavedItems => {
  try {
    const current = parse(localStorage.getItem(KEY));
    if (current) return current;
    const legacy = parse(localStorage.getItem(LEGACY_KEY));
    if (legacy) {
      // Migrate, but never clear the legacy key (harmless fallback).
      try {
        localStorage.setItem(KEY, JSON.stringify(legacy));
      } catch {
        /* ignore */
      }
      return legacy;
    }
  } catch (error) {
    console.error("Could not load saved items", error);
  }
  // No stored data at all → start empty WITHOUT writing anything yet.
  return empty();
};

const read = (): SavedItems => {
  if (!cache) cache = hydrate();
  return cache;
};

/** Persist after every mutation. */
const write = (next: SavedItems) => {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch (error) {
    console.error("Could not persist saved items", error);
  }
  listeners.forEach((l) => l());
};

// Keep other tabs/windows of the same origin in sync.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY) return;
    cache = parse(e.newValue) ?? empty();
    listeners.forEach((l) => l());
  });
}

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
  // Always keep a stable topic id alongside display text.
  const topicId =
    typeof meta?.topicId === "string"
      ? meta.topicId
      : typeof meta?.theme === "string"
        ? meta.theme
        : type === "word"
          ? id.split(":")[0]
          : undefined;
  const nextMeta = topicId ? { ...meta, topicId } : meta;
  write({ ...all, [key]: [{ id, type, savedAt: Date.now(), meta: nextMeta }, ...all[key]] });
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
