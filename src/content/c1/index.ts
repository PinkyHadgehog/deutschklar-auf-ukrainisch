// Агрегатор контенту C1.
import { verbenC1 } from "./verben";
import type { C1Map } from "./_helpers";
import type { LessonContent } from "@/content/lessons";
import type { LessonExtras } from "@/content/lessonExtensions";
import type { ExerciseItem } from "@/content/exerciseSets";

const all: C1Map = {
  ...verbenC1,
};

export const c1ExtraLessons: Record<string, LessonContent> = Object.fromEntries(
  Object.entries(all).filter(([, v]) => v.lesson).map(([k, v]) => [k, v.lesson as LessonContent])
);

export const c1Extras: Record<string, LessonExtras> = Object.fromEntries(
  Object.entries(all).map(([k, v]) => [k, v.extras])
);

export const c1Exercises15: Record<string, ExerciseItem[]> = Object.fromEntries(
  Object.entries(all).map(([k, v]) => [k, v.exercises15])
);
