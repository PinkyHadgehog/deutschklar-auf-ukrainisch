// Агрегатор контенту C2.
import { verbenC2 } from "./verben";
import type { C2Map } from "./_helpers";
import type { LessonContent } from "@/content/lessons";
import type { LessonExtras } from "@/content/lessonExtensions";
import type { ExerciseItem } from "@/content/exerciseSets";

const all: C2Map = {
  ...verbenC2,
};

export const c2ExtraLessons: Record<string, LessonContent> = Object.fromEntries(
  Object.entries(all).filter(([, v]) => v.lesson).map(([k, v]) => [k, v.lesson as LessonContent])
);

export const c2Extras: Record<string, LessonExtras> = Object.fromEntries(
  Object.entries(all).map(([k, v]) => [k, v.extras])
);

export const c2Exercises15: Record<string, ExerciseItem[]> = Object.fromEntries(
  Object.entries(all).map(([k, v]) => [k, v.exercises15])
);
