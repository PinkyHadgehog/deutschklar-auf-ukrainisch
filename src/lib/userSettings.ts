/**
 * Shared frontend-only user settings.
 *
 * Later this can be swapped for a Python REST API:
 *   GET   /api/users/me/settings
 *   PATCH /api/users/me/settings   { "weekly_xp_goal": 120, "daily_study_minutes_goal": 20 }
 */

export type WeekDayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type XpDistributionMode = "even" | "days" | "custom";

/** Monday-first order — never change to Sunday-first. */
export const WEEK_DAYS: WeekDayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
export const WEEK_DAY_LABELS: Record<WeekDayKey, string> = {
  mon: "Пн", tue: "Вт", wed: "Ср", thu: "Чт", fri: "Пт", sat: "Сб", sun: "Нд",
};

export type DailyXpGoals = Record<WeekDayKey, number>;

export interface UserSettings {
  weeklyXpGoal: number;
  dailyStudyMinutesGoal: number;
  xpDistributionMode: XpDistributionMode;
  /** Days selected in "days" mode. */
  studyDays: WeekDayKey[];
  /** Manual per-day targets used in "custom" mode. */
  dailyXpGoals: DailyXpGoals;
}

export const DEFAULT_WEEKLY_XP_GOAL = 100;
export const MIN_WEEKLY_XP_GOAL = 10;
export const MAX_WEEKLY_XP_GOAL = 1000;
export const WEEKLY_GOAL_PRESETS = [50, 100, 150, 200];

export const DEFAULT_DAILY_MINUTES_GOAL = 20;
export const MIN_DAILY_MINUTES_GOAL = 5;
export const MAX_DAILY_MINUTES_GOAL = 480;
export const DAILY_GOAL_PRESETS = [10, 20, 30, 45, 60];

const KEY = "dk_user_settings";
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((l) => l());

/** Split `total` over `days` keys as whole numbers whose sum equals `total` exactly. */
export const distributeEvenly = (total: number, days: WeekDayKey[]): DailyXpGoals => {
  const out = emptyGoals();
  if (days.length === 0) return out;
  const base = Math.floor(total / days.length);
  let rest = total - base * days.length;
  days.forEach((d) => {
    out[d] = base + (rest > 0 ? 1 : 0);
    if (rest > 0) rest -= 1;
  });
  return out;
};

export function emptyGoals(): DailyXpGoals {
  return { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 };
}

export const sumGoals = (goals: DailyXpGoals): number =>
  WEEK_DAYS.reduce((s, d) => s + (goals[d] || 0), 0);


export const isValidWeeklyGoal = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isInteger(value) &&
  value >= MIN_WEEKLY_XP_GOAL &&
  value <= MAX_WEEKLY_XP_GOAL;

export const isValidDailyMinutesGoal = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isInteger(value) &&
  value >= MIN_DAILY_MINUTES_GOAL &&
  value <= MAX_DAILY_MINUTES_GOAL;

export const getUserSettings = (): UserSettings => {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    const goal = parsed?.weeklyXpGoal;
    const daily = parsed?.dailyStudyMinutesGoal;
    return {
      weeklyXpGoal: isValidWeeklyGoal(goal) ? goal : DEFAULT_WEEKLY_XP_GOAL,
      dailyStudyMinutesGoal: isValidDailyMinutesGoal(daily) ? daily : DEFAULT_DAILY_MINUTES_GOAL,
    };
  } catch {
    return {
      weeklyXpGoal: DEFAULT_WEEKLY_XP_GOAL,
      dailyStudyMinutesGoal: DEFAULT_DAILY_MINUTES_GOAL,
    };
  }
};

const persist = (patch: Partial<UserSettings>) => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...getUserSettings(), ...patch }));
  } catch {
    /* ignore */
  }
  notify();
};

export const getWeeklyXpGoal = (): number => getUserSettings().weeklyXpGoal;
export const getDailyStudyMinutesGoal = (): number => getUserSettings().dailyStudyMinutesGoal;

/** Persist a new weekly goal. Returns false when the value is invalid. */
export const setWeeklyXpGoal = (value: number): boolean => {
  if (!isValidWeeklyGoal(value)) return false;
  persist({ weeklyXpGoal: value });
  return true;
};

/** Persist a new daily study-time goal (minutes). Returns false when invalid. */
export const setDailyStudyMinutesGoal = (value: number): boolean => {
  if (!isValidDailyMinutesGoal(value)) return false;
  persist({ dailyStudyMinutesGoal: value });
  return true;
};

export const subscribeUserSettings = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};
