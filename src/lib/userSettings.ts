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
/** Locale-neutral fallback abbreviations; UI components use t("dashboard.weekdays.*") instead. */
export const WEEK_DAY_LABELS: Record<WeekDayKey, string> = {
  mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
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

const sanitizeDays = (value: unknown): WeekDayKey[] => {
  if (!Array.isArray(value)) return [...WEEK_DAYS];
  const days = WEEK_DAYS.filter((d) => value.includes(d));
  return days.length ? days : [...WEEK_DAYS];
};

const sanitizeGoals = (value: unknown): DailyXpGoals => {
  const out = emptyGoals();
  if (!value || typeof value !== "object") return out;
  WEEK_DAYS.forEach((d) => {
    const v = (value as Record<string, unknown>)[d];
    if (typeof v === "number" && Number.isFinite(v) && v >= 0) out[d] = Math.round(v);
  });
  return out;
};

const DEFAULTS: UserSettings = {
  weeklyXpGoal: DEFAULT_WEEKLY_XP_GOAL,
  dailyStudyMinutesGoal: DEFAULT_DAILY_MINUTES_GOAL,
  xpDistributionMode: "even",
  studyDays: [...WEEK_DAYS],
  dailyXpGoals: distributeEvenly(DEFAULT_WEEKLY_XP_GOAL, WEEK_DAYS),
};

export const getUserSettings = (): UserSettings => {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    const goal = parsed?.weeklyXpGoal;
    const daily = parsed?.dailyStudyMinutesGoal;
    const mode = parsed?.xpDistributionMode;
    return {
      weeklyXpGoal: isValidWeeklyGoal(goal) ? goal : DEFAULT_WEEKLY_XP_GOAL,
      dailyStudyMinutesGoal: isValidDailyMinutesGoal(daily) ? daily : DEFAULT_DAILY_MINUTES_GOAL,
      xpDistributionMode: mode === "days" || mode === "custom" ? mode : "even",
      studyDays: sanitizeDays(parsed?.studyDays),
      dailyXpGoals: sanitizeGoals(parsed?.dailyXpGoals),
    };
  } catch {
    return { ...DEFAULTS };
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

/**
 * Planned XP per weekday, derived from the current mode.
 * "even"/"days" are computed from the weekly goal, "custom" uses stored values.
 */
export const getEffectiveDailyXpGoals = (settings: UserSettings = getUserSettings()): DailyXpGoals => {
  if (settings.xpDistributionMode === "custom") return { ...settings.dailyXpGoals };
  const days = settings.xpDistributionMode === "days" ? settings.studyDays : WEEK_DAYS;
  return distributeEvenly(settings.weeklyXpGoal, days);
};

/** Persist a new weekly goal. Returns false when the value is invalid. */
export const setWeeklyXpGoal = (value: number): boolean => {
  if (!isValidWeeklyGoal(value)) return false;
  persist({ weeklyXpGoal: value });
  return true;
};

/** Persist the daily XP distribution plan (mode + selected days + custom values). */
export const setXpDistribution = (patch: {
  mode: XpDistributionMode;
  studyDays?: WeekDayKey[];
  dailyXpGoals?: DailyXpGoals;
}) => {
  const current = getUserSettings();
  persist({
    xpDistributionMode: patch.mode,
    studyDays: patch.studyDays?.length ? patch.studyDays : current.studyDays,
    dailyXpGoals: patch.dailyXpGoals ?? current.dailyXpGoals,
  });
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
