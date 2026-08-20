/**
 * Derived progress: category / level / overall.
 *
 * There is exactly ONE source of truth — the lesson status store in
 * `@/lib/lessonProgress`. Nothing here is persisted; every value is computed.
 */

import { useEffect, useState } from "react";
import { grammarCategories, type Level } from "@/data/mock";
import {
  getLessonProgressValue,
  isLessonCompletedStatus,
  subscribeLessonProgress,
} from "@/lib/lessonProgress";

export interface LessonRef {
  id: string;
  title: string;
  level: Level;
  categoryId: string;
  topicSlug: string;
}

/** Flat catalogue of every lesson in the app (sub-lessons, or the topic itself). */
export const allLessons: LessonRef[] = grammarCategories.flatMap((cat) =>
  cat.topics.flatMap((topic) =>
    topic.sub && topic.sub.length > 0
      ? topic.sub.map((s) => ({
          id: s.slug,
          title: s.title,
          level: topic.level,
          categoryId: cat.id,
          topicSlug: topic.slug,
        }))
      : [
          {
            id: topic.slug,
            title: topic.title,
            level: topic.level,
            categoryId: cat.id,
            topicSlug: topic.slug,
          },
        ],
  ),
);

export const getTopicLessonIds = (topicSlug: string): string[] =>
  allLessons.filter((l) => l.topicSlug === topicSlug).map((l) => l.id);

export const getLevelLessonIds = (level: Level): string[] =>
  allLessons.filter((l) => l.level === level).map((l) => l.id);

/** Average of the lesson progress values (0 / 25 / 100). */
export const getCategoryProgress = (lessonIds: string[]): number => {
  if (!lessonIds.length) return 0;
  const total = lessonIds.reduce((sum, id) => sum + getLessonProgressValue(id), 0);
  return Math.round(total / lessonIds.length);
};

export const getTopicProgress = (topicSlug: string): number =>
  getCategoryProgress(getTopicLessonIds(topicSlug));

export const getLevelProgress = (level: Level): number =>
  getCategoryProgress(getLevelLessonIds(level));

export const getOverallProgress = (): number =>
  getCategoryProgress(allLessons.map((l) => l.id));

/** Only "completed" lessons count here — "started" does not. */
export const getCompletedLessonCount = (lessonIds: string[]): number =>
  lessonIds.filter((id) => isLessonCompletedStatus(id)).length;

export interface AggregateStats {
  progress: number;
  total: number;
  completed: number;
}

export const getAggregate = (lessonIds: string[]): AggregateStats => ({
  progress: getCategoryProgress(lessonIds),
  total: lessonIds.length,
  completed: getCompletedLessonCount(lessonIds),
});

/** Re-renders the component whenever any lesson status changes. */
export const useProgressVersion = (): number => {
  const [version, setVersion] = useState(0);
  useEffect(() => subscribeLessonProgress(() => setVersion((v) => v + 1)), []);
  return version;
};

export const useLevelStats = (level: Level): AggregateStats => {
  useProgressVersion();
  return getAggregate(getLevelLessonIds(level));
};

export const useTopicStats = (topicSlug: string): AggregateStats => {
  useProgressVersion();
  return getAggregate(getTopicLessonIds(topicSlug));
};

export const useOverallStats = (): AggregateStats => {
  useProgressVersion();
  return getAggregate(allLessons.map((l) => l.id));
};
