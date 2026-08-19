/**
 * Simple frontend-only lesson progress store.
 *
 * Three states only:
 *   not_started = 0%  ·  in_progress = 50%  ·  completed = 100%
 *
 * Later this maps 1:1 to a Python backend:
 *   PATCH /api/lessons/{lessonId}/progress  { status, progress }
 */

import { useEffect, useState } from "react";

export type LessonStatus = "not_started" | "in_progress" | "completed";

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  progress: 0 | 50 | 100;
}

export const statusProgress: Record<LessonStatus, 0 | 50 | 100> = {
  not_started: 0,
  in_progress: 50,
  completed: 100,
};

export const statusLabel: Record<LessonStatus, string> = {
  not_started: "Ще не розпочато",
  in_progress: "У процесі",
  completed: "Урок завершено",
};

export const statusShortLabel: Record<LessonStatus, string> = {
  not_started: "Не розпочато",
  in_progress: "У процесі",
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

export const getLessonProgress = (lessonId: string): LessonProgress =>
  read()[lessonId] ?? { lessonId, status: "not_started", progress: 0 };

/** Placeholder for PATCH /api/lessons/{lessonId}/progress */
export const setLessonStatus = (lessonId: string, status: LessonStatus): LessonProgress => {
  const entry: LessonProgress = { lessonId, status, progress: statusProgress[status] };
  write({ ...read(), [lessonId]: entry });
  return entry;
};

/** Marks a lesson as in_progress unless it is already completed. */
export const markLessonOpened = (lessonId: string) => {
  const current = getLessonProgress(lessonId);
  if (current.status === "not_started") setLessonStatus(lessonId, "in_progress");
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
    markCompleted: () => lessonId && setLessonStatus(lessonId, "completed"),
  };
};
