import type { Dict, Lang } from "./types";

import ukCommon from "./uk/common";
import ukHome from "./uk/home";
import ukDashboard from "./uk/dashboard";
import ukCourses from "./uk/courses";
import ukLesson from "./uk/lesson";
import ukVocab from "./uk/vocab";
import ukProgress from "./uk/progress";
import ukSaved from "./uk/saved";
import ukProfile from "./uk/profile";
import ukAuth from "./uk/auth";
import ukPlacement from "./uk/placement";
import ukPricing from "./uk/pricing";

import deCommon from "./de/common";
import deHome from "./de/home";
import deDashboard from "./de/dashboard";
import deCourses from "./de/courses";
import deLesson from "./de/lesson";
import deVocab from "./de/vocab";
import deProgress from "./de/progress";
import deSaved from "./de/saved";
import deProfile from "./de/profile";
import deAuth from "./de/auth";
import dePlacement from "./de/placement";
import dePricing from "./de/pricing";

export type { Lang } from "./types";

const merge = (...parts: unknown[]): Dict => Object.assign({}, ...parts) as Dict;

export const dictionaries: Record<Lang, Dict> = {
  uk: merge(ukCommon, {
    home: ukHome,
    dashboard: ukDashboard,
    courses: ukCourses,
    lesson: ukLesson,
    vocab: ukVocab,
    progressPage: ukProgress,
    savedPage: ukSaved,
    profile: ukProfile,
    auth: ukAuth,
    placement: ukPlacement,
    pricing: ukPricing,
  }),
  de: merge(deCommon, {
    home: deHome,
    dashboard: deDashboard,
    courses: deCourses,
    lesson: deLesson,
    vocab: deVocab,
    progressPage: deProgress,
    savedPage: deSaved,
    profile: deProfile,
    auth: deAuth,
    placement: dePlacement,
    pricing: dePricing,
  }),
};

const lookup = (dict: Dict, path: string): string | undefined => {
  let cur: unknown = dict;
  for (const part of path.split(".")) {
    if (cur && typeof cur === "object" && part in (cur as Dict)) cur = (cur as Dict)[part];
    else return undefined;
  }
  return typeof cur === "string" ? cur : undefined;
};

/**
 * Translate `path` for `lang`.
 * Falls back to Ukrainian, then to the key itself (so missing keys are visible in dev).
 * Supports {placeholders} via `vars`.
 */
export const translate = (path: string, lang: Lang, vars?: Record<string, string | number>): string => {
  const raw = lookup(dictionaries[lang], path) ?? lookup(dictionaries.uk, path) ?? path;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
};
