/**
 * Simple frontend-only lesson progress store.
 *
 * Three states:
 *   not_started = 0%  ·  started = 0%  ·  completed = 100%
 *
 * Later this maps 1:1 to a Python backend:
 *   PATCH /api/lessons/{lessonId}/progress  { status, progress }
 */

import { useEffect, useState } from "react";

export type LessonStatus = "not_started" | "started" | "completed";

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  progress: 0 | 25 | 100;
}

export const statusProgress: Record<LessonStatus, 0 | 25 | 100> = {
  not_started: 0,
  started: 25,
  completed: 100,
};

export const statusLabel: Record<LessonStatus, string> = {
  not_started: "Ще не розпочато",
  started: "Урок розпочато",
  completed: "Урок завершено",
};

export const statusShortLabel: Record<LessonStatus, string> = {
  not_started: "Не розпочато",
  started: "Розпочато",
  completed: "Завершено",
};

const KEY = "dk_lesson_progress";
const listeners = new Set<() => void>();

const read = (): Record<string, LessonProgress> => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const write = (all: Record<string, LessonProgress>) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
};

const normalize = (raw: unknown): LessonStatus => {
  // Legacy "in_progress" entries map to "started".
  if (raw === "completed") return "completed";
  if (raw === "started" || raw === "in_progress") return "started";
  return "not_started";
};

export const getLessonProgress = (lessonId: string): LessonProgress => {
  const status = normalize(read()[lessonId]?.status);
  return { lessonId, status, progress: statusProgress[status] };
};

/** Placeholder for PATCH /api/lessons/{lessonId}/progress */
export const setLessonStatus = (lessonId: string, status: LessonStatus): LessonProgress => {
  const entry: LessonProgress = { lessonId, status, progress: statusProgress[status] };
  write({ ...read(), [lessonId]: entry });
  return entry;
};

/** Called once when a lesson page opens: not_started → started. Never downgrades. */
export const markLessonStarted = (lessonId: string): LessonProgress => {
  const current = getLessonProgress(lessonId);
  if (current.status !== "not_started") return current;
  return setLessonStatus(lessonId, "started");
};

export const subscribeLessonProgress = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

/** React hook for a single lesson. */
export const useLessonProgress = (lessonId?: string) => {
  const [state, setState] = useState<LessonProgress>(() =>
    lessonId ? getLessonProgress(lessonId) : { lessonId: "", status: "not_started", progress: 0 },
  );

  useEffect(() => {
    if (!lessonId) return;
    setState(getLessonProgress(lessonId));
    return subscribeLessonProgress(() => setState(getLessonProgress(lessonId)));
  }, [lessonId]);

  return {
    ...state,
    setStatus: (s: LessonStatus) => lessonId && setLessonStatus(lessonId, s),
    markStarted: () => lessonId && markLessonStarted(lessonId),
    markCompleted: () => lessonId && setLessonStatus(lessonId, "completed"),
    markNotStarted: () => lessonId && setLessonStatus(lessonId, "not_started"),
  };
};
