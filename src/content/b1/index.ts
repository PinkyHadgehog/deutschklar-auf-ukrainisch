// Агрегатор контенту B1.
import { verbenB1 } from "./verben";
import { konjunktionenB1 } from "./konjunktionen";
import { zeitenB1 } from "./zeiten";
import { genitivB1 } from "./genitiv";
import { wortbildungB1 } from "./wortbildung";
import type { B1Map } from "./_helpers";
import type { LessonContent } from "@/content/lessons";
import type { LessonExtras } from "@/content/lessonExtensions";
import type { ExerciseItem } from "@/content/exerciseSets";

const all: B1Map = {
  ...verbenB1,
  ...konjunktionenB1,
  ...zeitenB1,
  ...genitivB1,
  ...wortbildungB1,
};

export const b1ExtraLessons: Record<string, LessonContent> = Object.fromEntries(
  Object.entries(all).filter(([, v]) => v.lesson).map(([k, v]) => [k, v.lesson as LessonContent])
);

export const b1Extras: Record<string, LessonExtras> = Object.fromEntries(
  Object.entries(all).map(([k, v]) => [k, v.extras])
);

export const b1Exercises15: Record<string, ExerciseItem[]> = Object.fromEntries(
  Object.entries(all).map(([k, v]) => [k, v.exercises15])
);
