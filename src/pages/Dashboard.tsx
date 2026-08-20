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
import { getWeeklyCompletedLessons, getWeeklyCompletedQuizzes, subscribeCompletionEvents, getCurrentWeekRange } from "@/lib/weeklyStats";
import { getRecommendations, type Recommendation, type RecommendationType } from "@/lib/recommendations";
import { subscribeVocabMistakes } from "@/lib/vocabMistakes";
import { subscribeLessonProgress } from "@/lib/lessonProgress";
import { getWeeklyStudySeconds, formatStudyTime, subscribeStudyTime } from "@/lib/studyTime";
import { Flame, Clock, Trophy, Target, BookOpen, ChevronRight, Sparkles, Play, RotateCw, AlertTriangle, ArrowRight } from "lucide-react";

const recIcon: Record<RecommendationType, typeof Play> = {
  continue_lesson: Play,
  vocabulary_review: RotateCw,
  weak_quiz: AlertTriangle,
  next_lesson: ArrowRight,
};

const Dashboard = () => {
  const { user } = useAuth();
  const [dailyXp, setDailyXp] = useState(0);
  const [breakdown, setBreakdown] = useState<{ label: string; xp: number }[]>([]);
  const [weeklyXp, setWeeklyXp] = useState(0);
  const [weeklyByDay, setWeeklyByDay] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [weeklyGoal, setWeeklyGoal] = useState(100);
  const [weeklySeconds, setWeeklySeconds] = useState(0);
  const [weeklyLessons, setWeeklyLessons] = useState(0);
  const [weeklyQuizzes, setWeeklyQuizzes] = useState(0);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    const sync = () => {
      setDailyXp(getDailyXp());
      setBreakdown(getDailyBreakdown());
      setWeeklyXp(getWeeklyXp());
      setWeeklyByDay(getWeeklyXpByDay());
      setWeeklyGoal(getWeeklyXpGoal());
      setWeeklySeconds(getWeeklyStudySeconds());
      setWeeklyLessons(getWeeklyCompletedLessons());
      setWeeklyQuizzes(getWeeklyCompletedQuizzes());
      setRecommendations(getRecommendations({
        level: user?.level ?? "A1",
        completedLessonSlugs: (user?.completedLessons ?? []).map((l) => l.slug),
        excludeIds: user?.completedLessons?.[0]?.slug ? [user.completedLessons[0].slug] : [],
      }));
    };
    sync();
    const un1 = subscribeLearningEvents(sync);
    const un2 = subscribeUserSettings(sync);
    const un3 = subscribeStudyTime(sync);
    const un4 = subscribeCompletionEvents(sync);
    const un5 = subscribeLessonProgress(sync);
    const un6 = subscribeVocabMistakes(sync);
    return () => { un1(); un2(); un3(); un4(); un5(); un6(); };
  }, [user?.level, user?.completedLessons]);

  if (!user) return <Navigate to="/login" replace />;


  const myCourse = courses.find((c) => c.level === user.level) ?? courses[1];
  const completedCount = user.completedLessons.length;
  const totalLessons = courses.reduce((s, c) => s + c.lessons, 0);
  const courseProgress = Math.min(100, Math.round((completedCount / Math.max(1, myCourse.lessons)) * 100) + myCourse.progress);
  const displayedProgress = Math.min(100, completedCount > 0 ? courseProgress : myCourse.progress);
  const lastLesson = user.completedLessons[0];
  const weekDone = Math.min(100, Math.round((weeklyXp / Math.max(1, weeklyGoal)) * 100));
  const goalReached = weeklyXp >= weeklyGoal;
  const { start: weekStart, end: weekEnd } = getCurrentWeekRange();
  const dayShort = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const fmtDay = (d: Date) => `${dayShort[d.getDay()]} · ${d.toLocaleDateString("uk-UA", { day: "numeric", month: "short" })}`;
  const weekRangeLabel = `${fmtDay(weekStart)} — ${fmtDay(weekEnd)}`;
  const weekEmpty = weeklyLessons === 0 && weeklyQuizzes === 0 && weeklySeconds === 0;
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
            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded-xl bg-white/15 p-3 backdrop-blur text-left hover:bg-white/25 transition">
                  <div className="flex items-center justify-between">
                    <Clock className="h-5 w-5 mb-1.5" />
                    <Pencil className="h-3.5 w-3.5 opacity-80" />
                  </div>
                  <div className="text-2xl font-bold">{dailyGoal} хв</div>
                  <div className="text-xs opacity-80">ціль на день</div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                <DailyGoalEditor />
              </PopoverContent>
            </Popover>
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
          <Progress value={weekDone} className="h-2 mb-2" />
          <div className="flex items-center justify-between text-xs mb-4">
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">{weeklyXp}</span> / {weeklyGoal} XP
            </span>
            {goalReached && <span className="font-semibold text-accent-foreground">🎉 Тижнева ціль досягнута!</span>}
          </div>
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

        {/* Weekly activity */}
        <section className="lg:col-span-3 mt-3">
          <div className="mb-4">
            <h2 className="font-display text-xl md:text-2xl font-extrabold">Цього тижня</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{weekRangeLabel}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { i: BookOpen, v: weeklyLessons, l: "Уроків завершено", s: "📖 цього тижня" },
              { i: Sparkles, v: weeklyQuizzes, l: "Квізів складено", s: "✨ цього тижня" },
              { i: Clock, v: formatStudyTime(weeklySeconds), l: "Активного навчання", s: "⏱ цього тижня" },
            ].map((s, idx) => (
              <Card key={idx} className="p-5 rounded-2xl border-0 shadow-soft">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary-soft grid place-items-center shrink-0">
                    <s.i className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">{s.l}</div>
                    <div className="font-display font-extrabold text-2xl leading-tight mt-0.5">{s.v}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.s}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {weekEmpty && (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>Цього тижня ще немає навчальної активності.</span>
              <Link to="/courses" className="font-semibold text-primary hover:underline">Почати навчання</Link>
            </div>
          )}
          <div className="border-t mt-8" />
        </section>

        {/* Last lesson */}
        <Card className="p-6 rounded-2xl border-0 shadow-soft lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
            <div>
              <div className="font-display font-bold text-lg">Остання лекція</div>
              <p className="text-sm text-muted-foreground">Продовжуй з того місця, де зупинилася</p>
            </div>
            <Badge variant="secondary" className="bg-primary-soft text-primary">B1 · Граматика</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-secondary/60">
            <div className="h-14 w-14 rounded-xl bg-gradient-primary grid place-items-center shrink-0">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-[12rem]">
              <div className="font-semibold truncate">{lastLesson?.title ?? "Adjektivdeklination nach dem bestimmten Artikel"}</div>
              <div className="text-sm text-muted-foreground">
                {lastLesson
                  ? `Завершено ${new Date(lastLesson.completedAt).toLocaleDateString("uk-UA")} · +${lastLesson.points} балів`
                  : "Прогрес: 62% · 4 вправи залишилось"}
              </div>
              <Progress value={lastLesson ? 100 : 62} className="h-1.5 mt-2" />
            </div>
            <Button asChild size="sm" className="bg-gradient-primary">
              <Link to={`/lesson/${lastLesson?.slug ?? "adjektivdeklination-bestimmter"}`}>{lastLesson ? "Повторити" : "Продовжити"}</Link>
            </Button>
          </div>
        </Card>


        {/* Recommendations */}
        <Card className="p-6 rounded-2xl border-0 shadow-soft">
          <div className="font-display font-bold mb-3 flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Рекомендовано вам</div>
          <ul className="space-y-2">
            {recommendations.map((r) => {
              const Icon = recIcon[r.type];
              return (
                <li key={`${r.type}-${r.id}`}>
                  <Link to={r.href} className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/60 transition">
                    <span className="mt-0.5 h-7 w-7 rounded-lg bg-primary-soft grid place-items-center shrink-0">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium truncate">{r.title}</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">{r.context}</span>
                    </span>
                    <Badge variant="outline" className="text-xs shrink-0">{r.level}</Badge>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
