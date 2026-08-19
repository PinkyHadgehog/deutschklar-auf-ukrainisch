/**
 * Shared frontend-only weekly completion stats (lessons + quizzes).
 *
 * One single source of truth for the week range used everywhere on the
 * Dashboard (XP, XP goal, lessons, quizzes, study time).
 *
 * Later this maps to the Python backend:
 *   POST /api/lessons/{id}/completion   { completed_at }
 *   POST /api/quizzes/completion        { topic_id, completed_at, score, total }
 *   GET  /api/progress/weekly
 */

export interface WeekRange {
  start: Date; // Monday 00:00:00.000 (local)
  end: Date; // Sunday 23:59:59.999 (local)
}

/** Current week, Monday 00:00 → Sunday 23:59:59.999, learner's local timezone. */
export const getCurrentWeekRange = (ref: Date = new Date()): WeekRange => {
  const start = new Date(ref);
  const dayIdx = (start.getDay() + 6) % 7; // Monday = 0
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - dayIdx);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

export const isInCurrentWeek = (iso: string, ref: Date = new Date()): boolean => {
  const { start, end } = getCurrentWeekRange(ref);
  const t = new Date(iso).getTime();
  return t >= start.getTime() && t <= end.getTime();
};

/* ---------------- completion events ---------------- */

export interface LessonCompletionEvent {
  type: "lesson_completed";
  lessonId: string;
  completedAt: string; // ISO
}

export interface QuizCompletionEvent {
  type: "vocabulary_quiz_completed";
  topicId: string;
  completedAt: string; // ISO
  score: number;
  total: number;
}

export type CompletionEvent = LessonCompletionEvent | QuizCompletionEvent;

const KEY = "dk_completion_events";
const listeners = new Set<() => void>();

export const subscribeCompletionEvents = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

const read = (): CompletionEvent[] => {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? (parsed as CompletionEvent[]) : [];
  } catch {
    return [];
  }
};

const write = (events: CompletionEvent[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(events));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
};

export const getCompletionEvents = (): CompletionEvent[] => read();

/**
 * Records a lesson completion. Idempotent for the *current* completion state:
 * re-opening or repeating a lesson does not add a second event unless the
 * completion was undone in between.
 */
export const recordLessonCompletion = (lessonId: string, at: Date = new Date()) => {
  const events = read();
  const exists = events.some((e) => e.type === "lesson_completed" && e.lessonId === lessonId);
  if (exists) return;
  write([...events, { type: "lesson_completed", lessonId, completedAt: at.toISOString() }]);
};

/** Undo: removes the lesson's current (latest) completion event. */
export const removeLessonCompletion = (lessonId: string) => {
  const events = read();
  let lastIdx = -1;
  events.forEach((e, i) => {
    if (e.type === "lesson_completed" && e.lessonId === lessonId) lastIdx = i;
  });
  if (lastIdx < 0) return;
  write(events.filter((_, i) => i !== lastIdx));
};

/** Standard (non-repeat) vocabulary quiz finished — mistake review must not call this. */
export const recordQuizCompletion = (
  topicId: string,
  score: number,
  total: number,
  at: Date = new Date()
) => {
  write([
    ...read(),
    { type: "vocabulary_quiz_completed", topicId, completedAt: at.toISOString(), score, total },
  ]);
};

/* ---------------- weekly aggregation ---------------- */

/** Unique lessons completed Monday–Sunday of the current week. */
export const getWeeklyCompletedLessons = (): number => {
  const ids = new Set<string>();
  read().forEach((e) => {
    if (e.type === "lesson_completed" && isInCurrentWeek(e.completedAt)) ids.add(e.lessonId);
  });
  return ids.size;
};

/** Standard quizzes completed Monday–Sunday of the current week. */
export const getWeeklyCompletedQuizzes = (): number =>
  read().filter((e) => e.type === "vocabulary_quiz_completed" && isInCurrentWeek(e.completedAt)).length;
