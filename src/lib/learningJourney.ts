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

export type JourneyCase = "in_progress" | "ready_for_next" | "new_learner" | "level_completed";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

/** First lesson of a level that is not yet completed/started (or simply the first one). */
export const getFirstLessonOfLevel = (level: Level): LessonRef | null => {
  const all = getAllLessonProgress();
  const inLevel = lessonIndex.filter((l) => l.level === level);
  const free = inLevel.find((l) => {
    const s = all[l.slug]?.status;
    return s !== "completed" && s !== "started";
  });
  return free ?? inLevel[0] ?? null;
};

/** True when every lesson of the level is completed (and the level has lessons). */
export const isLevelCompleted = (level: Level): boolean => {
  const all = getAllLessonProgress();
  const inLevel = lessonIndex.filter((l) => l.level === level);
  if (!inLevel.length) return false;
  return inLevel.every((l) => all[l.slug]?.status === "completed");
};

export const getNextLevel = (level: Level): Level | null => {
  const i = LEVELS.indexOf(level);
  return i >= 0 && i < LEVELS.length - 1 ? LEVELS[i + 1] : null;
};

export interface LearningJourney {
  state: JourneyCase;
  lastCompletedLesson: JourneyLesson | null;
  currentStartedLesson: JourneyLesson | null;
  nextLesson: LessonRef | null;
  level: Level;
  nextLevel: Level | null;
  nextLevelLesson: LessonRef | null;
}

export const getLearningJourneyState = (level: Level): LearningJourney => {
  const lastCompletedLesson = getLastCompletedLesson();
  const currentStartedLesson = getCurrentStartedLesson();
  const levelDone = !currentStartedLesson && isLevelCompleted(level);
  const nextLevel = getNextLevel(level);
  const nextLevelLesson = levelDone && nextLevel ? getFirstLessonOfLevel(nextLevel) : null;

  const state: JourneyCase = currentStartedLesson
    ? "in_progress"
    : levelDone
      ? "level_completed"
      : lastCompletedLesson
        ? "ready_for_next"
        : "new_learner";

  const nextLesson =
    state === "level_completed"
      ? nextLevelLesson
      : state === "new_learner"
        ? getFirstLessonOfLevel(level)
        : getNextLesson(level);

  return { state, lastCompletedLesson, currentStartedLesson, nextLesson, level, nextLevel, nextLevelLesson };
};

/** Back-compat alias. */
export const getLearningJourney = getLearningJourneyState;
