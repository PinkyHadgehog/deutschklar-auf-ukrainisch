import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
  const [goal, setGoal] = useState(() => getDailyStudyMinutesGoal());
  const [value, setValue] = useState(() => String(getDailyStudyMinutesGoal()));
  const [error, setError] = useState<string | null>(null);

  const save = (raw: string) => {
    const num = Number(raw);
    if (!raw.trim() || !Number.isInteger(num) || !setDailyStudyMinutesGoal(num)) {
      setError(`Введи значення від ${MIN_DAILY_MINUTES_GOAL} до ${MAX_DAILY_MINUTES_GOAL} хв.`);
      return;
    }
    setError(null);
    setGoal(num);
    setValue(String(num));
    toast.success("Щоденну ціль збережено");
    onSaved?.();
  };

  return (
    <div>
      <div className="font-display font-bold">Щоденна ціль</div>
      <p className="text-sm text-muted-foreground mt-1">Скільки часу ти хочеш навчатися щодня?</p>

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
            {p} хв
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Інше:</span>
        <Input
          type="number"
          min={MIN_DAILY_MINUTES_GOAL}
          max={MAX_DAILY_MINUTES_GOAL}
          step={1}
          className="w-24 h-9"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(null); }}
        />
        <span className="text-sm text-muted-foreground">хв</span>
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <Button className="mt-3 w-full bg-gradient-primary" onClick={() => save(value)}>Зберегти</Button>
    </div>
  );
};

export default DailyGoalEditor;
