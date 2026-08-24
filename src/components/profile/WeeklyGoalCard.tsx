import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Target, Clock } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import DailyGoalEditor from "@/components/goals/DailyGoalEditor";
import WeeklyGoalEditor from "@/components/goals/WeeklyGoalEditor";
import XpDistributionEditor from "@/components/goals/XpDistributionEditor";
import { getDailyStudyMinutesGoal, getWeeklyXpGoal, subscribeUserSettings } from "@/lib/userSettings";

const WeeklyGoalCard = () => {
  const { t } = useLang();
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
        <Target className="h-4 w-4 text-primary" /> {t("profile.goals.title")}
      </div>
      <p className="text-sm text-muted-foreground">
        {t("profile.goals.hint")}
      </p>

      <div className="mt-5 grid sm:grid-cols-2 gap-5">
        <div className="rounded-xl bg-secondary/50 p-4">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" /> {t("profile.goals.daily")}
          </div>
          <div className="font-display font-extrabold text-2xl mt-0.5">{t("profile.goals.dailyValue", { n: daily })}</div>
          <div className="mt-4">
            <DailyGoalEditor />
          </div>
        </div>

        <div className="rounded-xl bg-secondary/50 p-4">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-primary" /> {t("profile.goals.weekly")}
          </div>
          <div className="font-display font-extrabold text-2xl mt-0.5">{t("profile.goals.weeklyValue", { n: weekly })}</div>
          <div className="mt-4">
            <WeeklyGoalEditor />
          </div>
        </div>

        <div className="sm:col-span-2 rounded-xl bg-secondary/50 p-4">
          <XpDistributionEditor />
        </div>
      </div>
    </Card>
  );
};


export default WeeklyGoalCard;
