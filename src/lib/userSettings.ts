/**
 * Shared frontend-only user settings.
 *
 * Later this can be swapped for a Python REST API:
 *   GET   /api/users/me/settings
 *   PATCH /api/users/me/settings   { "weekly_xp_goal": 120 }
 */

export interface UserSettings {
  weeklyXpGoal: number;
}

export const DEFAULT_WEEKLY_XP_GOAL = 100;
export const MIN_WEEKLY_XP_GOAL = 10;
export const MAX_WEEKLY_XP_GOAL = 1000;
export const WEEKLY_GOAL_PRESETS = [50, 100, 150, 200];

const KEY = "dk_user_settings";
const listeners = new Set<() => void>();

export const isValidWeeklyGoal = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isInteger(value) &&
  value >= MIN_WEEKLY_XP_GOAL &&
  value <= MAX_WEEKLY_XP_GOAL;

export const getUserSettings = (): UserSettings => {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    const goal = parsed?.weeklyXpGoal;
    return { weeklyXpGoal: isValidWeeklyGoal(goal) ? goal : DEFAULT_WEEKLY_XP_GOAL };
  } catch {
    return { weeklyXpGoal: DEFAULT_WEEKLY_XP_GOAL };
  }
};

export const getWeeklyXpGoal = (): number => getUserSettings().weeklyXpGoal;

/** Persist a new weekly goal. Returns false when the value is invalid. */
export const setWeeklyXpGoal = (value: number): boolean => {
  if (!isValidWeeklyGoal(value)) return false;
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...getUserSettings(), weeklyXpGoal: value }));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
  return true;
};

export const subscribeUserSettings = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};
