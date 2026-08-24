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
import { recordLessonCompletion, removeLessonCompletion } from "@/lib/weeklyStats";

export type LessonStatus = "not_started" | "started" | "completed";

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  progress: 0 | 25 | 100;
  startedAt?: string | null;
  completedAt?: string | null;
  lastOpenedAt?: string | null;
  updatedAt?: number;
}

/** Single mapping status → percentage. Never duplicate this elsewhere. */
export const statusToProgress = (status: LessonStatus): 0 | 25 | 100 => {
  switch (status) {
    case "completed":
      return 100;
    case "started":
      return 25;
    default:
      return 0;
  }
};

export const statusProgress: Record<LessonStatus, 0 | 25 | 100> = {
  not_started: statusToProgress("not_started"),
  started: statusToProgress("started"),
  completed: statusToProgress("completed"),
};


/** Translation keys — resolve with t() in components. */
export const statusLabel: Record<LessonStatus, string> = {
  not_started: "lesson.status.longNotStarted",
  started: "lesson.status.longStarted",
  completed: "lesson.status.longCompleted",
};

export const statusShortLabel: Record<LessonStatus, string> = {
  not_started: "lesson.status.shortNotStarted",
  started: "lesson.status.shortStarted",
  completed: "lesson.status.shortCompleted",
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

const hydrate = (id: string, entry: Partial<LessonProgress> | undefined): LessonProgress => {
  const status = normalize(entry?.status);
  return {
    lessonId: id,
    status,
    progress: statusToProgress(status),
    startedAt: entry?.startedAt ?? null,
    completedAt: entry?.completedAt ?? null,
    lastOpenedAt: entry?.lastOpenedAt ?? null,
    updatedAt: entry?.updatedAt,
  };
};

/** All stored lesson progress entries (frontend store snapshot). */
export const getAllLessonProgress = (): Record<string, LessonProgress> => {
  const all = read();
  const out: Record<string, LessonProgress> = {};
  Object.entries(all).forEach(([id, entry]) => {
    out[id] = hydrate(id, entry);
  });
  return out;
};

export const getLessonProgressEntry = (lessonId: string): LessonProgress =>
  hydrate(lessonId, read()[lessonId]);

export const getLessonProgress = (lessonId: string): LessonProgress =>
  getLessonProgressEntry(lessonId);

/** Percentage only — derived from status. */
export const getLessonProgressValue = (lessonId: string): number =>
  statusToProgress(getLessonProgressEntry(lessonId).status);

export const isLessonCompletedStatus = (lessonId: string): boolean =>
  getLessonProgressEntry(lessonId).status === "completed";

/** Placeholder for PATCH /api/lessons/{lessonId}/progress */
export const setLessonStatus = (lessonId: string, status: LessonStatus): LessonProgress => {
  const current = getLessonProgressEntry(lessonId);
  if (status === "completed") recordLessonCompletion(lessonId);
  else if (current.status === "completed") removeLessonCompletion(lessonId);

  const now = new Date().toISOString();
  const entry: LessonProgress = {
    lessonId,
    status,
    progress: statusToProgress(status),
    startedAt:
      status === "not_started" ? null : current.startedAt ?? now,
    completedAt: status === "completed" ? current.completedAt ?? now : null,
    lastOpenedAt: current.lastOpenedAt ?? now,
    updatedAt: Date.now(),
  };
  write({ ...read(), [lessonId]: entry });
  return entry;
};

/** Called once when a lesson page opens: not_started → started. Never downgrades. */
export const markLessonStarted = (lessonId: string): LessonProgress => {
  const current = getLessonProgressEntry(lessonId);
  if (current.status !== "not_started") return current;
  return setLessonStatus(lessonId, "started");
};

/** Records a visit without changing the status. */
export const touchLessonOpened = (lessonId: string): LessonProgress => {
  const current = getLessonProgressEntry(lessonId);
  const entry: LessonProgress = { ...current, lastOpenedAt: new Date().toISOString() };
  write({ ...read(), [lessonId]: entry });
  return entry;
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
