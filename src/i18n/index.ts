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

/**
 * Namespace files come in two shapes: plain objects that need wrapping under
 * their namespace, and files that already carry the namespace themselves
 * (either as a top-level key or as flat "ns.some.key" entries).
 */
const ns = (name: string, mod: Record<string, unknown>): Dict => {
  const keys = Object.keys(mod);
  const selfNamespaced =
    keys.length > 0 && keys.every((k) => k === name || k.startsWith(`${name}.`) || !k.includes("."));
  const carriesOwnNamespace =
    keys.length > 0 && keys.some((k) => k === name || k.startsWith(`${name}.`));
  if (selfNamespaced && carriesOwnNamespace) return mod as Dict;
  return { [name]: mod } as Dict;
};

const buildDict = (
  common: Dict,
  parts: Record<string, Record<string, unknown>>,
): Dict => merge(common, ...Object.entries(parts).map(([name, mod]) => ns(name, mod)));

export const dictionaries: Record<Lang, Dict> = {
  uk: buildDict(ukCommon as Dict, {
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
  de: buildDict(deCommon as Dict, {
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
  const flat = (dict as Record<string, unknown>)[path];
  if (typeof flat === "string") return flat;
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
