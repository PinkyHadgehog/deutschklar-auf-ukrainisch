/**
 * Shared frontend-only active study-time tracking.
 *
 * One global tracker — never overlapping timers. Learning screens register a
 * "claim" (type + sourceId + priority); the highest-priority claim is the
 * active study session. Time only accumulates while:
 *   - a claim is active (learner is inside a learning area)
 *   - the tab is visible (Page Visibility API)
 *   - the learner interacted within the last 5 minutes
 *
 * Later this can be swapped for a Python REST API:
 *   POST /api/study-sessions   { activity_type, source_id, started_at, duration_seconds }
 *   GET  /api/progress/weekly-study-time
 */

import { getCurrentWeekRange, isInCurrentWeek } from "@/lib/weeklyStats";

export type StudyActivityType =
  | "lesson"
  | "lesson_exercises"
  | "vocabulary"
  | "flashcards"
  | "vocabulary_quiz"
  | "mistake_review";

export interface StudySession {
  id: string;
  type: StudyActivityType;
  sourceId: string;
  startedAt: string; // ISO
  durationSeconds: number;
}

/** Translation keys — resolve with t() in components. */
export const studyTypeLabel: Record<StudyActivityType, string> = {
  lesson: "dashboard.studyType.lesson",
  lesson_exercises: "dashboard.studyType.lessonExercises",
  vocabulary: "dashboard.studyType.vocabulary",
  flashcards: "dashboard.studyType.flashcards",
  vocabulary_quiz: "dashboard.studyType.vocabularyQuiz",
  mistake_review: "dashboard.studyType.mistakeReview",
};

const KEY = "dk_study_sessions";
export const IDLE_TIMEOUT_MS = 5 * 60 * 1000;
const FLUSH_EVERY_SECONDS = 15;

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export const subscribeStudyTime = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

const read = (): StudySession[] => {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? (parsed as StudySession[]) : [];
  } catch {
    return [];
  }
};

const write = (sessions: StudySession[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(sessions));
  } catch {
    /* ignore */
  }
};

export const getStudySessions = (): StudySession[] => read();

/* ---------------- tracker ---------------- */

interface Claim {
  id: number;
  type: StudyActivityType;
  sourceId: string;
  priority: number;
}

interface ActiveSession {
  id: string;
  type: StudyActivityType;
  sourceId: string;
  startedAt: string;
  seconds: number; // accumulated but not yet flushed to storage
  flushed: number; // already written to storage
}

let claims: Claim[] = [];
let claimSeq = 0;
let active: ActiveSession | null = null;
let lastActivity = Date.now();
let ticker: ReturnType<typeof setInterval> | null = null;
let sinceFlush = 0;
let wired = false;

const topClaim = (): Claim | null =>
  claims.length ? claims.reduce((a, b) => (b.priority >= a.priority ? b : a)) : null;

const flush = () => {
  if (!active || active.seconds === 0) return;
  const sessions = read();
  const idx = sessions.findIndex((s) => s.id === active!.id);
  const total = active.flushed + active.seconds;
  if (idx >= 0) sessions[idx] = { ...sessions[idx], durationSeconds: total };
  else
    sessions.push({
      id: active.id,
      type: active.type,
      sourceId: active.sourceId,
      startedAt: active.startedAt,
      durationSeconds: total,
    });
  active.flushed = total;
  active.seconds = 0;
  write(sessions);
  notify();
};

const endActive = () => {
  flush();
  active = null;
  sinceFlush = 0;
};

const isIdle = () => Date.now() - lastActivity > IDLE_TIMEOUT_MS;
const isHidden = () => typeof document !== "undefined" && document.hidden;

const tick = () => {
  const claim = topClaim();
  if (!claim) {
    if (active) endActive();
    return;
  }
  if (isHidden() || isIdle()) {
    if (active && active.seconds > 0) flush();
    return;
  }
  if (!active || active.type !== claim.type || active.sourceId !== claim.sourceId) {
    endActive();
    active = {
      id: `${claim.type}-${claim.sourceId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: claim.type,
      sourceId: claim.sourceId,
      startedAt: new Date().toISOString(),
      seconds: 0,
      flushed: 0,
    };
  }
  active.seconds += 1;
  sinceFlush += 1;
  if (sinceFlush >= FLUSH_EVERY_SECONDS) {
    sinceFlush = 0;
    flush();
  }
  notify();
};

const markActivity = () => {
  lastActivity = Date.now();
};

const wire = () => {
  if (wired || typeof window === "undefined") return;
  wired = true;
  const opts = { passive: true, capture: true } as AddEventListenerOptions;
  ["pointerdown", "click", "keydown", "wheel", "touchstart", "scroll", "input"].forEach((ev) =>
    window.addEventListener(ev, markActivity, opts)
  );
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) flush();
    else markActivity();
  });
  window.addEventListener("pagehide", flush);
  window.addEventListener("beforeunload", flush);
};

const ensureTicker = () => {
  wire();
  if (ticker) return;
  ticker = setInterval(tick, 1000);
};

/** Register a learning-area claim. Returns an unregister function. */
export const registerStudyClaim = (
  type: StudyActivityType,
  sourceId: string,
  priority = 0
): (() => void) => {
  ensureTicker();
  markActivity();
  const claim: Claim = { id: ++claimSeq, type, sourceId, priority };
  claims = [...claims, claim];
  return () => {
    claims = claims.filter((c) => c.id !== claim.id);
    if (!claims.length) endActive();
  };
};

/** Seconds of the current in-flight session not yet written to storage. */
export const getPendingSeconds = (): number => (active ? active.seconds : 0);

/* ---------------- weekly aggregation ---------------- */

/** Monday 00:00 of the current week (local time). */
export const getStudyWeekStart = (ref = new Date()): Date => getCurrentWeekRange(ref).start;

const inCurrentWeek = (iso: string) => isInCurrentWeek(iso);

export const getWeekStudySessions = (): StudySession[] => read().filter((s) => inCurrentWeek(s.startedAt));

/** Active study seconds this week, including the current unfinished session. */
export const getWeeklyStudySeconds = (): number => {
  const stored = getWeekStudySessions().reduce((sum, s) => sum + s.durationSeconds, 0);
  const pending = active && inCurrentWeek(active.startedAt) ? active.seconds : 0;
  return stored + pending;
};

/** Per-activity-type seconds this week (for a future Fortschritt breakdown). */
export const getWeeklyStudyBreakdown = (): { type: StudyActivityType; label: string; seconds: number }[] => {
  const map = new Map<StudyActivityType, number>();
  getWeekStudySessions().forEach((s) => map.set(s.type, (map.get(s.type) ?? 0) + s.durationSeconds));
  if (active && inCurrentWeek(active.startedAt) && active.seconds > 0) {
    map.set(active.type, (map.get(active.type) ?? 0) + active.seconds);
  }
  return [...map.entries()]
    .map(([type, seconds]) => ({ type, label: studyTypeLabel[type], seconds }))
    .sort((a, b) => b.seconds - a.seconds);
};

/**
 * 2940 → "49 min" · 5100 → "1 h 25 min" · 10800 → "3 h"
 * `t` is the LanguageContext translator, injected by the caller.
 */
export const formatStudyTime = (seconds: number, t: (key: string, vars?: Record<string, string | number>) => string): string => {
  const total = Math.max(0, Math.floor(seconds / 60));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return t("dashboard.studyTime.minutes", { n: m });
  if (m === 0) return t("dashboard.studyTime.hours", { n: h });
  return t("dashboard.studyTime.hoursMinutes", { h, m });
};
