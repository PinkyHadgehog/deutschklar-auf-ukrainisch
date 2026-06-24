// Агрегатор контенту A2.
import { verbenA2 } from "./verben";
import { adjektiveA2 } from "./adjektive";
import type { A2Map } from "./_helpers";
import type { LessonContent } from "@/content/lessons";
import type { LessonExtras } from "@/content/lessonExtensions";
import type { ExerciseItem } from "@/content/exerciseSets";

const all: A2Map = {
  ...verbenA2,
  ...adjektiveA2,
};

export const a2ExtraLessons: Record<string, LessonContent> = Object.fromEntries(
  Object.entries(all).filter(([, v]) => v.lesson).map(([k, v]) => [k, v.lesson as LessonContent])
);

export const a2Extras: Record<string, LessonExtras> = Object.fromEntries(
  Object.entries(all).map(([k, v]) => [k, v.extras])
);

export const a2Exercises15: Record<string, ExerciseItem[]> = Object.fromEntries(
  Object.entries(all).map(([k, v]) => [k, v.exercises15])
);
