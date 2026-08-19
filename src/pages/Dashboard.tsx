import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/context/AuthContext";
import { courses } from "@/data/mock";
import { getDailyXp, getDailyBreakdown, subscribeLearningEvents, getWeeklyXp, getWeeklyXpByDay } from "@/lib/xp";
import { getWeeklyXpGoal, subscribeUserSettings } from "@/lib/userSettings";
import { Flame, Clock, Trophy, Target, BookOpen, ChevronRight, Sparkles } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [dailyXp, setDailyXp] = useState(0);
  const [breakdown, setBreakdown] = useState<{ label: string; xp: number }[]>([]);
  const [weeklyXp, setWeeklyXp] = useState(0);
  const [weeklyByDay, setWeeklyByDay] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [weeklyGoal, setWeeklyGoal] = useState(100);

  useEffect(() => {
    const sync = () => {
      setDailyXp(getDailyXp());
      setBreakdown(getDailyBreakdown());
      setWeeklyXp(getWeeklyXp());
      setWeeklyByDay(getWeeklyXpByDay());
      setWeeklyGoal(getWeeklyXpGoal());
    };
    sync();
    const un1 = subscribeLearningEvents(sync);
    const un2 = subscribeUserSettings(sync);
    return () => { un1(); un2(); };
  }, []);

  if (!user) return <Navigate to="/login" replace />;


  const myCourse = courses.find((c) => c.level === user.level) ?? courses[1];
  const completedCount = user.completedLessons.length;
  const totalLessons = courses.reduce((s, c) => s + c.lessons, 0);
  const courseProgress = Math.min(100, Math.round((completedCount / Math.max(1, myCourse.lessons)) * 100) + myCourse.progress);
  const displayedProgress = Math.min(100, completedCount > 0 ? courseProgress : myCourse.progress);
  const lastLesson = user.completedLessons[0];
  const weekDone = Math.min(100, Math.round((weeklyXp / Math.max(1, weeklyGoal)) * 100));
  const goalReached = weeklyXp >= weeklyGoal;
  const maxDay = Math.max(1, ...weeklyByDay);
  const weekly = weeklyByDay.map((xp) => Math.round((xp / maxDay) * 100));

  return (
    <div className="container py-8 md:py-12">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-sm text-muted-foreground">Привіт 👋</div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-1">{user.name}, гарного навчання!</h1>
          <p className="text-muted-foreground mt-1">«Маленькі кроки щодня важливіші за великий ривок раз на місяць.»</p>
        </div>
        <Button asChild className="bg-gradient-primary h-11 px-6">
          <Link to={`/lesson/adjektivdeklination-bestimmter`}>Продовжити навчання <ChevronRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Progress card */}
        <Card className="p-6 rounded-2xl border-0 shadow-soft lg:col-span-2 bg-gradient-primary text-primary-foreground">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm opacity-80">Ваш поточний рівень</div>
              <div className="font-display text-5xl font-extrabold mt-1">{user.level}</div>
              <div className="opacity-90 mt-1">{myCourse.title}</div>
            </div>
            <div className="relative h-24 w-24">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" strokeWidth="10" stroke="rgba(255,255,255,0.25)" fill="none" />
                <circle cx="50" cy="50" r="42" strokeWidth="10" stroke="white" fill="none"
                  strokeDasharray={`${(displayedProgress / 100) * 264} 264`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 grid place-items-center font-display font-extrabold text-xl">{displayedProgress}%</div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/15 p-3 backdrop-blur">
              <Flame className="h-5 w-5 mb-1.5" />
              <div className="text-2xl font-bold">{user.streak}</div>
              <div className="text-xs opacity-80">днів поспіль</div>
            </div>
            <div className="rounded-xl bg-white/15 p-3 backdrop-blur">
              <Clock className="h-5 w-5 mb-1.5" />
              <div className="text-2xl font-bold">{user.goalMinutes} хв</div>
              <div className="text-xs opacity-80">ціль на день</div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded-xl bg-white/15 p-3 backdrop-blur text-left hover:bg-white/25 transition">
                  <Trophy className="h-5 w-5 mb-1.5" />
                  <div className="text-2xl font-bold">{dailyXp} XP</div>
                  <div className="text-xs opacity-80">XP сьогодні</div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="font-display font-bold mb-2">Сьогодні</div>
                {breakdown.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Сьогодні ще немає активності. Пройди Quiz або вправи уроку.</p>
                ) : (
                  <ul className="space-y-1 text-sm">
                    {breakdown.map((b, i) => (
                      <li key={i} className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">{b.label}</span>
                        <span className="font-semibold">+{b.xp} XP</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3 pt-2 border-t flex items-center justify-between text-sm font-bold">
                  <span>Разом</span><span>{dailyXp} XP</span>
                </div>
              </PopoverContent>
            </Popover>

          </div>
        </Card>

        {/* Week goal */}
        <Card className="p-6 rounded-2xl border-0 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="font-display font-bold">Тижнева ціль</div>
            <Badge className="bg-accent text-accent-foreground">{weekDone}%</Badge>
          </div>
          <Progress value={weekDone} className="h-2 mb-5" />
          <div className="flex items-end gap-1.5 h-24">
            {weekly.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-md bg-primary-soft" style={{ height: `${v}%` }}>
                  <div className="w-full rounded-md bg-gradient-primary h-full" style={{ opacity: v / 100 }} />
                </div>
                <div className="text-[10px] text-muted-foreground">{["Пн","Вт","Ср","Чт","Пт","Сб","Нд"][i]}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Last lesson */}
        <Card className="p-6 rounded-2xl border-0 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="font-display font-bold text-lg">Остання лекція</div>
            <Badge variant="secondary" className="bg-primary-soft text-primary">B1 · Граматика</Badge>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/60">
            <div className="h-14 w-14 rounded-xl bg-gradient-primary grid place-items-center shrink-0">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{lastLesson?.title ?? "Adjektivdeklination nach dem bestimmten Artikel"}</div>
              <div className="text-sm text-muted-foreground">
                {lastLesson
                  ? `Завершено ${new Date(lastLesson.completedAt).toLocaleDateString("uk-UA")} · +${lastLesson.points} балів`
                  : "Прогрес: 62% · 4 вправи залишилось"}
              </div>
              <Progress value={lastLesson ? 100 : 62} className="h-1.5 mt-2" />
            </div>
            <Button asChild size="sm" className="bg-gradient-primary">
              <Link to={`/lesson/${lastLesson?.slug ?? "adjektivdeklination-bestimmter"}`}>{lastLesson ? "Повторити" : "Далі"}</Link>
            </Button>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {[
              { i: BookOpen, n: 47 + completedCount, l: "Лекцій пройдено" },
              { i: Sparkles, n: 12, l: "Квізів складено" },
              { i: Clock, n: "8 год", l: "Часу за тиждень" },
            ].map((s, idx) => (
              <div key={idx} className="rounded-xl border bg-card p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary-soft grid place-items-center"><s.i className="h-5 w-5 text-primary" /></div>
                <div>
                  <div className="font-display font-bold text-xl">{s.n}</div>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recommendations */}
        <Card className="p-6 rounded-2xl border-0 shadow-soft">
          <div className="font-display font-bold mb-3 flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Рекомендовано вам</div>
          <ul className="space-y-2">
            {[
              { t: "Perfekt — sein чи haben?", lvl: "A2" },
              { t: "Modalverben у Präteritum", lvl: "B1" },
              { t: "Wortschatz: Bewerbung", lvl: "B1" },
              { t: "Trennbare Verben — практика", lvl: "A2" },
            ].map((r, i) => (
              <li key={i}>
                <Link to="/grammar" className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/60 transition">
                  <span className="text-sm font-medium">{r.t}</span>
                  <Badge variant="outline" className="text-xs">{r.lvl}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
