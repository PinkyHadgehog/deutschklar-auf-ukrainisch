import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Target, Clock } from "lucide-react";
import DailyGoalEditor from "@/components/goals/DailyGoalEditor";
import WeeklyGoalEditor from "@/components/goals/WeeklyGoalEditor";
import { getDailyStudyMinutesGoal, getWeeklyXpGoal, subscribeUserSettings } from "@/lib/userSettings";

const WeeklyGoalCard = () => {
  const [weekly, setWeekly] = useState(() => getWeeklyXpGoal());
  const [daily, setDaily] = useState(() => getDailyStudyMinutesGoal());

  useEffect(() => {
    const sync = () => {
      setWeekly(getWeeklyXpGoal());
      setDaily(getDailyStudyMinutesGoal());
    };
    sync();
    return subscribeUserSettings(sync);
  }, []);

  return (
    <Card className="p-6 rounded-2xl border-0 shadow-soft md:col-span-2">
      <div className="font-display font-bold mb-1 flex items-center gap-2">
        <Target className="h-4 w-4 text-primary" /> Мої цілі
      </div>
      <p className="text-sm text-muted-foreground">
        Щоденна ціль вимірюється у хвилинах навчання, тижнева — в XP.
      </p>

      <div className="mt-5 grid sm:grid-cols-2 gap-5">
        <div className="rounded-xl bg-secondary/50 p-4">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" /> Щоденна ціль
          </div>
          <div className="font-display font-extrabold text-2xl mt-0.5">{daily} хв / день</div>
          <div className="mt-4">
            <DailyGoalEditor />
          </div>
        </div>

        <div className="rounded-xl bg-secondary/50 p-4">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-primary" /> Тижнева ціль
          </div>
          <div className="font-display font-extrabold text-2xl mt-0.5">{weekly} XP / тиждень</div>
          <div className="mt-4">
            <WeeklyGoalEditor />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeeklyGoalCard;
