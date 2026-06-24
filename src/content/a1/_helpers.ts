import type { LessonContent } from "@/content/lessons";
import type { LessonExtras } from "@/content/lessonExtensions";
import type { ExerciseItem } from "@/content/exerciseSets";

export interface A1Lesson {
  lesson?: LessonContent;          // full new lesson — присутній, якщо slug відсутній у lessons.ts
  extras: LessonExtras;            // обов'язково
  exercises15: ExerciseItem[];     // рівно 15
}

export type A1Map = Record<string, A1Lesson>;
