import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/context/AuthContext";
import { courses } from "@/data/mock";
import { allLessons, getAggregate, getLevelLessonIds } from "@/lib/progressAggregate";
import { getDailyXp, getDailyBreakdown, subscribeLearningEvents, getWeeklyXp, getWeeklyXpByDay } from "@/lib/xp";
import { getWeeklyXpGoal, getDailyStudyMinutesGoal, subscribeUserSettings, getEffectiveDailyXpGoals, WEEK_DAYS, WEEK_DAY_LABELS, type DailyXpGoals, emptyGoals } from "@/lib/userSettings";
import { getWeeklyCompletedLessons, getWeeklyCompletedQuizzes, subscribeCompletionEvents, getCurrentWeekRange } from "@/lib/weeklyStats";
import { getRecommendations, type Recommendation, type RecommendationType } from "@/lib/recommendations";
import { subscribeVocabMistakes } from "@/lib/vocabMistakes";
import { subscribeLessonProgress } from "@/lib/lessonProgress";
import { getLearningJourney, type LearningJourney } from "@/lib/learningJourney";
import LearningJourneyCard from "@/components/dashboard/LearningJourneyCard";
import { getWeeklyStudySeconds, formatStudyTime, subscribeStudyTime } from "@/lib/studyTime";
import DailyGoalEditor from "@/components/goals/DailyGoalEditor";
import WeeklyGoalEditor from "@/components/goals/WeeklyGoalEditor";
import XpDistributionEditor from "@/components/goals/XpDistributionEditor";
import { Flame, Clock, Trophy, Target, BookOpen, ChevronRight, Sparkles, Play, RotateCw, AlertTriangle, ArrowRight, Pencil, Settings2 } from "lucide-react";

const recIcon: Record<RecommendationType, typeof Play> = {
  continue_lesson: Play,
  vocabulary_review: RotateCw,
  weak_quiz: AlertTriangle,
  next_lesson: ArrowRight,
};

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [dailyXp, setDailyXp] = useState(0);
  const [breakdown, setBreakdown] = useState<{ label: string; xp: number }[]>([]);
  const [weeklyXp, setWeeklyXp] = useState(0);
  const [weeklyByDay, setWeeklyByDay] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [weeklyGoal, setWeeklyGoal] = useState(100);
  const [dailyGoal, setDailyGoal] = useState(20);
  const [plannedGoals, setPlannedGoals] = useState<DailyXpGoals>(() => emptyGoals());
  const [weeklySeconds, setWeeklySeconds] = useState(0);
  const [weeklyLessons, setWeeklyLessons] = useState(0);
  const [weeklyQuizzes, setWeeklyQuizzes] = useState(0);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [journey, setJourney] = useState<LearningJourney>({ state: "new_learner", lastCompletedLesson: null, currentStartedLesson: null, nextLesson: null, level: "A1", nextLevel: "A2", nextLevelLesson: null });

  useEffect(() => {
    const sync = () => {
      setDailyXp(getDailyXp());
      setBreakdown(getDailyBreakdown());
      setWeeklyXp(getWeeklyXp());
      setWeeklyByDay(getWeeklyXpByDay());
      setWeeklyGoal(getWeeklyXpGoal());
      setDailyGoal(getDailyStudyMinutesGoal());
      setPlannedGoals(getEffectiveDailyXpGoals());
      setWeeklySeconds(getWeeklyStudySeconds());
      setWeeklyLessons(getWeeklyCompletedLessons());
      setWeeklyQuizzes(getWeeklyCompletedQuizzes());
      const j = getLearningJourney(user?.level ?? "A1");
      setJourney(j);
      setRecommendations(getRecommendations({
        level: user?.level ?? "A1",
        completedLessonSlugs: (user?.completedLessons ?? []).map((l) => l.slug),
        excludeIds: [j.lastCompletedLesson?.slug, j.currentStartedLesson?.slug, j.nextLesson?.slug].filter(Boolean) as string[],
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
  const levelStats = getAggregate(getLevelLessonIds(user.level));
  const totalLessons = allLessons.length;
  const displayedProgress = levelStats.progress;
  const weekDone = Math.round((weeklyXp / Math.max(1, weeklyGoal)) * 100);
  const visualProgress = Math.min(weekDone, 100);
  const goalReached = weeklyXp >= weeklyGoal;
  const { start: weekStart, end: weekEnd } = getCurrentWeekRange();
  const dayShort = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const fmtDay = (d: Date) => `${dayShort[d.getDay()]} · ${d.toLocaleDateString("uk-UA", { day: "numeric", month: "short" })}`;
  const weekRangeLabel = `${fmtDay(weekStart)} — ${fmtDay(weekEnd)}`;
  const weekEmpty = weeklyLessons === 0 && weeklyQuizzes === 0 && weeklySeconds === 0;
  const todayIndex = (new Date().getDay() + 6) % 7;
  const plannedByDay = WEEK_DAYS.map((d) => plannedGoals[d] || 0);
  const todayGoal = plannedByDay[todayIndex];
  const todayXp = weeklyByDay[todayIndex] ?? 0;
  const todayPct = todayGoal > 0 ? Math.round((todayXp / todayGoal) * 100) : 0;

  // Single shared definition: the Continue CTA always targets the Learning Journey's current lesson.
  const continueCta = journey.currentStartedLesson
    ? { label: "Продовжити навчання", href: `/lesson/${journey.currentStartedLesson.slug}` }
    : journey.nextLesson
      ? {
          label:
            journey.state === "new_learner"
              ? "Почати навчання"
              : journey.state === "level_completed"
                ? `Перейти до ${journey.nextLevel}`
                : "Почати наступний урок",
          href: `/lesson/${journey.nextLesson.slug}`,
        }
      : null;

  return (
    <div className="container py-8 md:py-12">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-sm text-muted-foreground">Привіт 👋</div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-1">{user.name}, гарного навчання!</h1>
          <p className="text-muted-foreground mt-1">«Маленькі кроки щодня важливіші за великий ривок раз на місяць.»</p>
        </div>
        {continueCta && (
          <Button asChild className="bg-gradient-primary h-11 px-6">
            <Link to={continueCta.href}>{continueCta.label} <ChevronRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        )}
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
            <Popover>
              <PopoverTrigger asChild>
                <button
                  aria-label="Змінити тижневу ціль"
                  className="h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:bg-muted hover:text-foreground transition"
                >
                  <Settings2 className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 max-h-[70vh] overflow-auto" align="end">
                <WeeklyGoalEditor />
                <div className="my-4 border-t" />
                <XpDistributionEditor />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-end justify-between gap-3 mb-2">
            <div className="font-display text-2xl font-extrabold leading-none">
              {weeklyXp} <span className="text-muted-foreground font-bold text-xl">/ {weeklyGoal} XP</span>
            </div>
            <span className="text-xs text-muted-foreground font-medium">{weekDone}%</span>
          </div>

          <Progress value={visualProgress} className="h-2 mb-4" />

          {/* Today */}
          <div className="rounded-xl bg-secondary/60 p-3 mb-4">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Сьогодні
            </div>
            {todayGoal > 0 ? (
              <>
                <div className="flex items-end justify-between gap-2 mt-0.5">
                  <div className="font-display font-extrabold text-lg leading-none">
                    {todayXp} <span className="text-muted-foreground font-bold text-sm">/ {todayGoal} XP</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{todayPct}%</span>
                </div>
                <Progress value={Math.min(todayPct, 100)} className="h-1.5 mt-2" />
              </>
            ) : (
              <div className="font-display font-extrabold text-lg leading-none mt-0.5">Вихідний день</div>
            )}
          </div>

          <div className="flex items-end gap-1.5 h-28">
            {plannedByDay.map((planned, i) => {
              const earned = weeklyByDay[i];
              const isToday = i === todayIndex;
              const fill = planned > 0 ? Math.min(100, Math.round((earned / planned) * 100)) : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                  <div className={`text-[10px] leading-tight text-center ${isToday ? "font-bold text-foreground" : "font-semibold text-muted-foreground"}`}>
                    {planned > 0 ? (
                      <>
                        {earned}
                        <span className="text-muted-foreground">/{planned}</span>
                        {earned >= planned && earned > 0 ? " ✓" : ""}
                      </>
                    ) : (
                      "—"
                    )}
                  </div>
                  <div className={`w-full rounded-md ${planned > 0 ? "bg-primary-soft" : "bg-muted"} h-12 flex flex-col justify-end overflow-hidden`}>
                    <div className="w-full rounded-md bg-gradient-primary" style={{ height: `${fill}%` }} />
                  </div>
                  <div className={`text-[10px] ${isToday ? "font-bold text-primary" : "text-muted-foreground"}`}>
                    {WEEK_DAY_LABELS[WEEK_DAYS[i]]}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 text-xs">
            {goalReached ? (
              <span className="font-semibold text-primary">🎉 Тижневу ціль досягнуто!</span>
            ) : weeklyXp === 0 ? (
              <span className="text-muted-foreground">Почни з першої активності цього тижня</span>
            ) : (
              <span className="text-muted-foreground">
                Ще <span className="font-semibold text-foreground">{weeklyGoal - weeklyXp} XP</span> до цілі
              </span>
            )}
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

        {/* Learning journey */}
        <LearningJourneyCard
          journey={journey}
          onSwitchLevel={
            journey.state === "level_completed" && journey.nextLevel
              ? () => updateUser({ level: journey.nextLevel! })
              : undefined
          }
        />




        {/* Recommendations */}
        <Card className="p-6 rounded-2xl border-0 shadow-soft">
          <div className="font-display font-bold mb-3 flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Рекомендовано вам</div>
          {recommendations.length === 0 && (
            <p className="text-sm text-muted-foreground">Поки немає що повторювати — проходь квізи та вправи, і тут з’являться персональні поради.</p>
          )}
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
