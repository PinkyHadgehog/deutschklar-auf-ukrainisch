/**
 * Shared frontend-only XP system.
 *
 * All learning activities (vocabulary quiz, lesson exercises, …) write a
 * LearningEvent here. Daily XP = sum of today's events.
 *
 * Later this can be swapped for a Python REST API:
 *   POST /api/lesson-exercises/result
 *   POST /api/quiz/result
 *   GET  /api/progress/daily
 */

export type LearningEventType = "vocabulary_quiz" | "lesson_exercises";

export interface LearningEvent {
  id: string;
  type: LearningEventType;
  sourceId: string;
  xp: number;
  timestamp: string; // ISO
}

const KEY = "dk_learning_events";
const listeners = new Set<() => void>();

export const eventTypeLabel: Record<LearningEventType, string> = {
  vocabulary_quiz: "Словниковий Quiz",
  lesson_exercises: "Вправи уроку",
};

const read = (): LearningEvent[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LearningEvent[]) : [];
  } catch {
    return [];
  }
};

const write = (events: LearningEvent[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(events));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
};

export const getLearningEvents = (): LearningEvent[] => read();

export const subscribeLearningEvents = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

const isToday = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

export const getTodayEvents = (): LearningEvent[] => read().filter((e) => isToday(e.timestamp));

export const getDailyXp = (): number => getTodayEvents().reduce((s, e) => s + e.xp, 0);

/** Breakdown items for the Dashboard XP card, newest last. */
export const getDailyBreakdown = (): { label: string; xp: number; timestamp: string }[] =>
  getTodayEvents()
    .slice()
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    .map((e) => ({ label: eventTypeLabel[e.type], xp: e.xp, timestamp: e.timestamp }));

export const addLearningEvent = (type: LearningEventType, sourceId: string, xp: number): LearningEvent => {
  const event: LearningEvent = {
    id: `${type}-${sourceId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    sourceId,
    xp,
    timestamp: new Date().toISOString(),
  };
  write([...read(), event]);
  return event;
};

/** True if this source already awarded XP (ever) — prevents farming the same set. */
export const hasAwardedXp = (type: LearningEventType, sourceId: string): boolean =>
  read().some((e) => e.type === type && e.sourceId === sourceId && e.xp > 0);

/* ---------- Lesson exercises XP rules (15 exercises) ---------- */

export const LESSON_EXERCISE_TOTAL = 15;
export const LESSON_EXERCISE_MAX_XP = 10;

/** 15/15 → 10 XP · 13–14 → 7 XP · 10–12 → 5 XP · 0–9 → 2 XP (scaled to `total`). */
export const lessonExerciseXp = (correct: number, total = LESSON_EXERCISE_TOTAL): number => {
  if (total <= 0) return 0;
  const scaled = Math.round((correct / total) * LESSON_EXERCISE_TOTAL);
  if (scaled >= 15) return 10;
  if (scaled >= 13) return 7;
  if (scaled >= 10) return 5;
  return 2;
};

export interface LessonExerciseResult {
  lesson_id: string;
  correct: number;
  total: number;
  percentage: number;
  xp_earned: number;
}

/** Placeholder for POST /api/lesson-exercises/result */
export const submitLessonExerciseResult = async (_payload: LessonExerciseResult) => {
  return { ok: true };
};
