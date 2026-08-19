import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Target } from "lucide-react";
import {
  MAX_WEEKLY_XP_GOAL,
  MIN_WEEKLY_XP_GOAL,
  WEEKLY_GOAL_PRESETS,
  getWeeklyXpGoal,
  setWeeklyXpGoal,
  subscribeUserSettings,
} from "@/lib/userSettings";

const WeeklyGoalCard = () => {
  const [goal, setGoal] = useState(() => getWeeklyXpGoal());
  const [value, setValue] = useState(() => String(getWeeklyXpGoal()));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const g = getWeeklyXpGoal();
      setGoal(g);
      setValue(String(g));
    };
    sync();
    return subscribeUserSettings(() => setGoal(getWeeklyXpGoal()));
  }, []);

  const save = (raw: string) => {
    const num = Number(raw);
    if (!raw.trim() || !Number.isInteger(num) || num < MIN_WEEKLY_XP_GOAL || num > MAX_WEEKLY_XP_GOAL) {
      setError(`Введи значення від ${MIN_WEEKLY_XP_GOAL} до ${MAX_WEEKLY_XP_GOAL} XP.`);
      return;
    }
    setError(null);
    setWeeklyXpGoal(num);
    setValue(String(num));
    toast.success("Тижневу ціль збережено");
  };

  return (
    <Card className="p-6 rounded-2xl border-0 shadow-soft md:col-span-2">
      <div className="font-display font-bold mb-1 flex items-center gap-2">
        <Target className="h-4 w-4 text-primary" /> Тижнева ціль
      </div>
      <p className="text-sm text-muted-foreground">Встанови, скільки XP ти хочеш набирати щотижня.</p>

      <div className="mt-4">
        <Label>Моя тижнева ціль</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {WEEKLY_GOAL_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => { setValue(String(p)); save(String(p)); }}
              className={`h-10 px-4 rounded-xl text-sm font-semibold border transition ${
                goal === p
                  ? "bg-gradient-primary text-primary-foreground border-transparent"
                  : "hover:bg-muted"
              }`}
            >
              {p} XP
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">Інше значення</Label>
            <div className="mt-1.5 flex items-center gap-2">
              <Input
                type="number"
                min={MIN_WEEKLY_XP_GOAL}
                max={MAX_WEEKLY_XP_GOAL}
                step={1}
                className="w-28"
                value={value}
                onChange={(e) => { setValue(e.target.value); setError(null); }}
              />
              <span className="text-sm text-muted-foreground">XP</span>
            </div>
          </div>
          <Button className="bg-gradient-primary" onClick={() => save(value)}>Зберегти ціль</Button>
        </div>

        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        <p className="mt-3 text-xs text-muted-foreground">
          Поточна ціль: <span className="font-bold text-foreground">{goal} XP</span> на тиждень
        </p>
      </div>
    </Card>
  );
};

export default WeeklyGoalCard;
