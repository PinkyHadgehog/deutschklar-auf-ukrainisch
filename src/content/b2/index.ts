// Агрегатор контенту B2.
import { verbenB2 } from "./verben";
import type { B2Map } from "./_helpers";
import type { LessonContent } from "@/content/lessons";
import type { LessonExtras } from "@/content/lessonExtensions";
import type { ExerciseItem } from "@/content/exerciseSets";

const all: B2Map = {
  ...verbenB2,
};

export const b2ExtraLessons: Record<string, LessonContent> = Object.fromEntries(
  Object.entries(all).filter(([, v]) => v.lesson).map(([k, v]) => [k, v.lesson as LessonContent])
);

export const b2Extras: Record<string, LessonExtras> = Object.fromEntries(
  Object.entries(all).map(([k, v]) => [k, v.extras])
);

export const b2Exercises15: Record<string, ExerciseItem[]> = Object.fromEntries(
  Object.entries(all).map(([k, v]) => [k, v.exercises15])
);
