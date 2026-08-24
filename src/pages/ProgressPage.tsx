import { Navigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { courses } from "@/data/mock";
import {
  getAggregate,
  getLevelLessonIds,
  useOverallStats,
} from "@/lib/progressAggregate";

const ProgressPage = () => {
  const { user } = useAuth();
  const { t } = useLang();
  const overall = useOverallStats();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl md:text-4xl font-extrabold">{t("progressPage.title")}</h1>
      <p className="text-muted-foreground mt-1">{t("progressPage.subtitle")}</p>

      <Card className="mt-6 p-5 rounded-2xl border-0 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="font-display font-bold">{t("progressPage.overallProgress")}</div>
          <span className="font-semibold text-primary">{overall.progress}%</span>
        </div>
        <Progress value={overall.progress} className="h-2 mt-3" />
        <div className="text-xs mt-1 text-muted-foreground">
          {t("progressPage.completedOf", { completed: overall.completed, total: overall.total })}
        </div>
      </Card>

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c) => {
          const stats = getAggregate(getLevelLessonIds(c.level));
          return (
            <Card key={c.level} className="p-5 rounded-2xl border-0 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="bg-primary-soft text-primary border-0">{c.level}</Badge>
                <span className="text-sm text-muted-foreground">{t("progressPage.lessonsCount", { n: stats.total })}</span>
              </div>
              <div className="font-display font-bold">{c.title}</div>
              <Progress value={stats.progress} className="h-2 mt-3" />
              <div className="text-xs mt-1 text-muted-foreground">
                {stats.progress}% · {t("progressPage.completedOf", { completed: stats.completed, total: stats.total })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
export default ProgressPage;
