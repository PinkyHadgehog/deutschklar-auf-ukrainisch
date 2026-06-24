// Агрегатор контенту A1.
// У наступних PR сюди додаються substantive / artikel / pronomen / faelle.

import { verbenA1 } from "./verben";
import { substantiveA1 } from "./substantive";
import { artikelA1 } from "./artikel";
import { pronomenA1 } from "./pronomen";
import { faelleA1 } from "./faelle";
import type { A1Map } from "./_helpers";
import type { LessonContent } from "@/content/lessons";
import type { LessonExtras } from "@/content/lessonExtensions";
import type { ExerciseItem } from "@/content/exerciseSets";

const all: A1Map = {
  ...verbenA1,
  ...substantiveA1,
  ...artikelA1,
  ...pronomenA1,
  ...faelleA1,
};


export const a1ExtraLessons: Record<string, LessonContent> = Object.fromEntries(
  Object.entries(all).filter(([, v]) => v.lesson).map(([k, v]) => [k, v.lesson as LessonContent])
);

export const a1Extras: Record<string, LessonExtras> = Object.fromEntries(
  Object.entries(all).map(([k, v]) => [k, v.extras])
);

export const a1Exercises15: Record<string, ExerciseItem[]> = Object.fromEntries(
  Object.entries(all).map(([k, v]) => [k, v.exercises15])
);
