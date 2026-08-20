import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
  const [goal, setGoal] = useState(() => getWeeklyXpGoal());
  const [value, setValue] = useState(() => String(getWeeklyXpGoal()));
  const [error, setError] = useState<string | null>(null);

  const save = (raw: string) => {
    const num = Number(raw);
    if (!raw.trim() || !Number.isInteger(num) || !setWeeklyXpGoal(num)) {
      setError(`Введи значення від ${MIN_WEEKLY_XP_GOAL} до ${MAX_WEEKLY_XP_GOAL} XP.`);
      return;
    }
    setError(null);
    setGoal(num);
    setValue(String(num));
    toast.success("Тижневу ціль збережено");
    onSaved?.();
  };

  return (
    <div>
      <div className="font-display font-bold">Моя тижнева ціль</div>
      <p className="text-sm text-muted-foreground mt-1">Скільки XP ти хочеш набирати щотижня?</p>

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
            {p} XP
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Інше:</span>
        <Input
          type="number"
          min={MIN_WEEKLY_XP_GOAL}
          max={MAX_WEEKLY_XP_GOAL}
          step={1}
          className="w-24 h-9"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(null); }}
        />
        <span className="text-sm text-muted-foreground">XP</span>
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <Button className="mt-3 w-full bg-gradient-primary" onClick={() => save(value)}>Зберегти ціль</Button>
    </div>
  );
};

export default WeeklyGoalEditor;
