import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLang } from "@/context/LanguageContext";
import {
  DAILY_GOAL_PRESETS,
  MAX_DAILY_MINUTES_GOAL,
  MIN_DAILY_MINUTES_GOAL,
  getDailyStudyMinutesGoal,
  setDailyStudyMinutesGoal,
} from "@/lib/userSettings";

interface Props {
  onSaved?: () => void;
}

const DailyGoalEditor = ({ onSaved }: Props) => {
  const { t } = useLang();
  const [goal, setGoal] = useState(() => getDailyStudyMinutesGoal());
  const [value, setValue] = useState(() => String(getDailyStudyMinutesGoal()));
  const [error, setError] = useState<string | null>(null);

  const save = (raw: string) => {
    const num = Number(raw);
    if (!raw.trim() || !Number.isInteger(num) || !setDailyStudyMinutesGoal(num)) {
      setError(t("dashboard.dailyEditor.error", { min: MIN_DAILY_MINUTES_GOAL, max: MAX_DAILY_MINUTES_GOAL }));
      return;
    }
    setError(null);
    setGoal(num);
    setValue(String(num));
    toast.success(t("dashboard.dailyEditor.saved"));
    onSaved?.();
  };

  return (
    <div>
      <div className="font-display font-bold">{t("dashboard.dailyEditor.title")}</div>
      <p className="text-sm text-muted-foreground mt-1">{t("dashboard.dailyEditor.subtitle")}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {DAILY_GOAL_PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => { setValue(String(p)); save(String(p)); }}
            className={`h-9 px-3 rounded-xl text-sm font-semibold border transition ${
              goal === p ? "bg-gradient-primary text-primary-foreground border-transparent" : "hover:bg-muted"
            }`}
          >
            {t("dashboard.dailyEditor.minutesShort", { n: p })}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{t("dashboard.dailyEditor.other")}</span>
        <Input
          type="number"
          min={MIN_DAILY_MINUTES_GOAL}
          max={MAX_DAILY_MINUTES_GOAL}
          step={1}
          className="w-24 h-9"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(null); }}
        />
        <span className="text-sm text-muted-foreground">{t("dashboard.dailyEditor.minutes")}</span>
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <Button className="mt-3 w-full bg-gradient-primary" onClick={() => save(value)}>{t("dashboard.dailyEditor.save")}</Button>
    </div>
  );
};

export default DailyGoalEditor;
