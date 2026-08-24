import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLang } from "@/context/LanguageContext";
import {
  MAX_WEEKLY_XP_GOAL,
  MIN_WEEKLY_XP_GOAL,
  WEEKLY_GOAL_PRESETS,
  getWeeklyXpGoal,
  setWeeklyXpGoal,
} from "@/lib/userSettings";

interface Props {
  onSaved?: () => void;
}

const WeeklyGoalEditor = ({ onSaved }: Props) => {
  const { t } = useLang();
  const [goal, setGoal] = useState(() => getWeeklyXpGoal());
  const [value, setValue] = useState(() => String(getWeeklyXpGoal()));
  const [error, setError] = useState<string | null>(null);

  const save = (raw: string) => {
    const num = Number(raw);
    if (!raw.trim() || !Number.isInteger(num) || !setWeeklyXpGoal(num)) {
      setError(t("dashboard.weeklyEditor.error", { min: MIN_WEEKLY_XP_GOAL, max: MAX_WEEKLY_XP_GOAL }));
      return;
    }
    setError(null);
    setGoal(num);
    setValue(String(num));
    toast.success(t("dashboard.weeklyEditor.saved"));
    onSaved?.();
  };

  return (
    <div>
      <div className="font-display font-bold">{t("dashboard.weeklyEditor.title")}</div>
      <p className="text-sm text-muted-foreground mt-1">{t("dashboard.weeklyEditor.subtitle")}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {WEEKLY_GOAL_PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => { setValue(String(p)); save(String(p)); }}
            className={`h-9 px-3 rounded-xl text-sm font-semibold border transition ${
              goal === p ? "bg-gradient-primary text-primary-foreground border-transparent" : "hover:bg-muted"
            }`}
          >
            {t("dashboard.weeklyEditor.xpShort", { n: p })}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{t("dashboard.weeklyEditor.other")}</span>
        <Input
          type="number"
          min={MIN_WEEKLY_XP_GOAL}
          max={MAX_WEEKLY_XP_GOAL}
          step={1}
          className="w-24 h-9"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(null); }}
        />
        <span className="text-sm text-muted-foreground">{t("dashboard.weeklyEditor.xp")}</span>
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <Button className="mt-3 w-full bg-gradient-primary" onClick={() => save(value)}>{t("dashboard.weeklyEditor.save")}</Button>
    </div>
  );
};

export default WeeklyGoalEditor;
