import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  DailyXpGoals,
  WEEK_DAYS,
  WEEK_DAY_LABELS,
  WeekDayKey,
  XpDistributionMode,
  distributeEvenly,
  emptyGoals,
  getEffectiveDailyXpGoals,
  getUserSettings,
  setXpDistribution,
  subscribeUserSettings,
  sumGoals,
} from "@/lib/userSettings";
import { getWeeklyXp, getWeeklyXpByDay, subscribeLearningEvents } from "@/lib/xp";

const MODES: { value: XpDistributionMode; label: string; hint: string }[] = [
  { value: "even", label: "Рівномірно", hint: "Ціль ділиться на всі 7 днів" },
  { value: "days", label: "Обрати навчальні дні", hint: "Ціль ділиться лише між обраними днями" },
  { value: "custom", label: "Власний план", hint: "Свій показник XP для кожного дня" },
];

/** Index of today, Monday = 0. */
const todayIdx = () => (new Date().getDay() + 6) % 7;

interface Props {
  onSaved?: () => void;
}

const XpDistributionEditor = ({ onSaved }: Props) => {
  const [weeklyGoal, setWeeklyGoal] = useState(() => getUserSettings().weeklyXpGoal);
  const [mode, setMode] = useState<XpDistributionMode>(() => getUserSettings().xpDistributionMode);
  const [days, setDays] = useState<WeekDayKey[]>(() => getUserSettings().studyDays);
  const [custom, setCustom] = useState<DailyXpGoals>(() => getEffectiveDailyXpGoals());

  useEffect(() => {
    const sync = () => setWeeklyGoal(getUserSettings().weeklyXpGoal);
    return subscribeUserSettings(sync);
  }, []);

  useEffect(() => subscribeLearningEvents(() => undefined), []);

  const preview: DailyXpGoals =
    mode === "custom" ? custom : distributeEvenly(weeklyGoal, mode === "days" ? days : WEEK_DAYS);
  const distributed = sumGoals(preview);
  const diff = distributed - weeklyGoal;

  const toggleDay = (d: WeekDayKey) => {
    setDays((prev) => {
      const next = prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d];
      return next.length ? WEEK_DAYS.filter((x) => next.includes(x)) : prev;
    });
  };

  const autoDistribute = () => {
    const remaining = weeklyGoal - sumGoals(custom);
    if (remaining === 0) return;
    if (remaining < 0) {
      setCustom(distributeEvenly(weeklyGoal, WEEK_DAYS));
      return;
    }
    const active = WEEK_DAYS.filter((d) => custom[d] > 0);
    const targets = active.length ? active : WEEK_DAYS;
    const extra = distributeEvenly(remaining, targets);
    const next = emptyGoals();
    WEEK_DAYS.forEach((d) => (next[d] = (custom[d] || 0) + (extra[d] || 0)));
    setCustom(next);
  };

  /** Redistribute the XP still missing this week over today → Sunday. */
  const replanWeek = () => {
    const earned = getWeeklyXp();
    const byDay = getWeeklyXpByDay();
    const remaining = Math.max(0, weeklyGoal - earned);
    const start = todayIdx();
    const rest = WEEK_DAYS.slice(start);
    const next = emptyGoals();
    WEEK_DAYS.slice(0, start).forEach((d, i) => (next[d] = byDay[i] || 0));
    const spread = distributeEvenly(remaining, rest);
    rest.forEach((d) => (next[d] = spread[d] || 0));
    setCustom(next);
    setMode("custom");
    toast.success("Тиждень перепланований — перевір і збережи");
  };

  const save = () => {
    if (mode === "custom" && diff !== 0) {
      toast.error(
        diff < 0
          ? `Розподілено ${distributed} з ${weeklyGoal} XP. Ще ${-diff} XP не розподілено.`
          : `Перевищено на ${diff} XP. Зменш денні цілі або натисни «Розподілити автоматично».`
      );
      return;
    }
    setXpDistribution({ mode, studyDays: days, dailyXpGoals: preview });
    toast.success("План на тиждень збережено");
    onSaved?.();
  };

  return (
    <div>
      <div className="font-display font-bold">Як розподілити ціль по днях?</div>
      <p className="text-sm text-muted-foreground mt-1">Тижнева ціль: {weeklyGoal} XP</p>

      <div className="mt-3 space-y-1.5">
        {MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => {
              if (m.value === "custom") setCustom(preview);
              setMode(m.value);
            }}
            className={`w-full text-left px-3 py-2 rounded-xl border transition ${
              mode === m.value ? "border-primary bg-primary-soft" : "hover:bg-muted"
            }`}
          >
            <div className="text-sm font-semibold">{m.label}</div>
            <div className="text-xs text-muted-foreground">{m.hint}</div>
          </button>
        ))}
      </div>

      {mode === "days" && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {WEEK_DAYS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => toggleDay(d)}
              aria-pressed={days.includes(d)}
              className={`h-9 w-11 rounded-xl text-sm font-semibold border transition ${
                days.includes(d)
                  ? "bg-gradient-primary text-primary-foreground border-transparent"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {WEEK_DAY_LABELS[d]}
            </button>
          ))}
        </div>
      )}

      {mode === "custom" ? (
        <div className="mt-3 space-y-1.5">
          {WEEK_DAYS.map((d) => (
            <div key={d} className="flex items-center gap-2">
              <span className="w-8 text-sm font-semibold text-muted-foreground">{WEEK_DAY_LABELS[d]}</span>
              <Input
                type="number"
                min={0}
                step={1}
                className="h-8 w-20"
                value={custom[d]}
                onChange={(e) =>
                  setCustom((prev) => ({ ...prev, [d]: Math.max(0, Math.round(Number(e.target.value) || 0)) }))
                }
              />
              <span className="text-xs text-muted-foreground">XP</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-7 gap-1 text-center">
          {WEEK_DAYS.map((d) => (
            <div key={d} className="rounded-lg bg-secondary/60 py-1.5">
              <div className="text-[10px] text-muted-foreground">{WEEK_DAY_LABELS[d]}</div>
              <div className="text-xs font-bold">{preview[d] > 0 ? preview[d] : "—"}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 text-xs">
        <span className="text-muted-foreground">
          Розподілено: <span className="font-semibold text-foreground">{distributed} / {weeklyGoal} XP</span>
        </span>
        {diff < 0 && (
          <div className="mt-1 text-amber-600 dark:text-amber-400 font-medium">
            Залишилось розподілити: {-diff} XP
          </div>
        )}
        {diff > 0 && (
          <div className="mt-1 text-destructive font-medium">Перевищено на: {diff} XP</div>
        )}
      </div>

      {mode === "custom" && diff !== 0 && (
        <Button variant="outline" size="sm" className="mt-2 w-full" onClick={autoDistribute}>
          Розподілити автоматично
        </Button>
      )}

      <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={replanWeek}>
        Перепланувати тиждень
      </Button>

      <Button className="mt-2 w-full bg-gradient-primary" onClick={save}>
        Зберегти
      </Button>
    </div>
  );
};

export default XpDistributionEditor;
