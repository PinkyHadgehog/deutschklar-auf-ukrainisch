/**
 * Selectors for the Dashboard "Твій навчальний шлях" section.
 *
 * Single source of truth: the lesson progress store (`lessonProgress`) plus the
 * flat course order (`lessonIndex`). No duplicate progress data is created here.
 */

import { getAllLessonProgress, type LessonProgress } from "@/lib/lessonProgress";
import { lessonIndex, type LessonRef } from "@/lib/recommendations";
import { getLearningEvents } from "@/lib/xp";
import type { Level } from "@/data/mock";

export interface JourneyLesson {
  slug: string;
  title: string;
  level: Level;
  order: number;
  progress: LessonProgress;
}

const bySlug = (slug: string): LessonRef | undefined => lessonIndex.find((l) => l.slug === slug);

const toJourneyLesson = (p: LessonProgress): JourneyLesson | null => {
  const ref = bySlug(p.lessonId);
  if (!ref) return null;
  return { ...ref, progress: p };
};

const time = (iso?: string | null) => (iso ? new Date(iso).getTime() : 0);

/** Most recently completed lesson (by completedAt). */
export const getLastCompletedLesson = (): JourneyLesson | null => {
  const items = Object.values(getAllLessonProgress())
    .filter((p) => p.status === "completed")
    .map(toJourneyLesson)
    .filter((x): x is JourneyLesson => !!x)
    .sort((a, b) => time(b.progress.completedAt) - time(a.progress.completedAt));
  return items[0] ?? null;
};

/**
 * The single source of truth for "the lesson the learner is currently on".
 * status === "started", most recent lastOpenedAt, falling back to startedAt.
 */
export const getCurrentStartedLesson = (): JourneyLesson | null => {
  const activity = (p: LessonProgress) =>
    Math.max(time(p.lastOpenedAt), time(p.startedAt), p.updatedAt ?? 0);
  const items = Object.values(getAllLessonProgress())
    .filter((p) => p.status === "started")
    .map(toJourneyLesson)
    .filter((x): x is JourneyLesson => !!x)
    .sort((a, b) => activity(b.progress) - activity(a.progress));
  return items[0] ?? null;
};


/**
 * Next lesson in the course order: the first lesson after the current anchor
 * that is neither completed nor started. Falls back to the learner's level.
 */
export const getNextLesson = (level: Level): LessonRef | null => {
  const all = getAllLessonProgress();
  const isFree = (l: LessonRef) => {
    const s = all[l.slug]?.status;
    return s !== "completed" && s !== "started";
  };
  const anchor = getCurrentStartedLesson() ?? getLastCompletedLesson();
  if (anchor) {
    const after = lessonIndex.filter((l) => l.order > anchor.order && isFree(l));
    if (after.length) return after[0];
  }
  const inLevel = lessonIndex.filter((l) => l.level === level && isFree(l));
  if (inLevel.length) return inLevel[0];
  return lessonIndex.find(isFree) ?? null;
};

/** XP recorded for a lesson's exercises (if any). */
export const getLessonXp = (slug: string): number =>
  getLearningEvents()
    .filter((e) => e.type === "lesson_exercises" && e.sourceId === slug)
    .reduce((s, e) => s + e.xp, 0);

export type JourneyCase = "started" | "completed_only" | "new";

export interface LearningJourney {
  state: JourneyCase;
  completed: JourneyLesson | null;
  current: JourneyLesson | null;
  next: LessonRef | null;
}

export const getLearningJourney = (level: Level): LearningJourney => {
  const completed = getLastCompletedLesson();
  const current = getCurrentStartedLesson();
  const next = getNextLesson(level);
  const state: JourneyCase = current ? "started" : completed ? "completed_only" : "new";
  return { state, completed, current, next };
};
