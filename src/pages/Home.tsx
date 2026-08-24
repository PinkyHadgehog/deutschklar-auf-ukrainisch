import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Check, BookOpen, Target, TrendingUp, Sparkles, ArrowRight, X,
  AlertTriangle, Lightbulb, PenLine, Compass, Brain, FileText, RotateCw, BarChart3, Globe2, Quote,
} from "lucide-react";
import { courses, plans } from "@/data/mock";
import { getAggregate, getLevelLessonIds, useProgressVersion } from "@/lib/progressAggregate";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { OksiPortrait } from "@/components/home/OksiPortrait";
import { PLACEMENT_ROUTE, PLACEMENT_EVENTS, trackPlacementEvent } from "@/components/placement/placement";

const levelBadge: Record<string, string> = {
  A1: "bg-teal-500",
  A2: "bg-blue-500",
  B1: "bg-violet-600",
  B2: "bg-indigo-600",
  C1: "bg-amber-500",
  C2: "bg-blue-900",
};

const H1 = "font-display font-extrabold tracking-tight leading-[1.08] text-[2.25rem] sm:text-5xl lg:text-[3.75rem]";
const H2 = "font-display font-extrabold tracking-tight leading-tight text-[1.75rem] sm:text-4xl lg:text-[2.75rem]";
const H3 = "font-display font-bold text-xl lg:text-2xl";
const LEAD = "text-[1.0625rem] md:text-lg text-muted-foreground";

const Home = () => {
  const { user } = useAuth();
  const { t } = useLang();
  useProgressVersion();
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  const levelOutcome: Record<string, { title: string; text: string }> = {
    A1: { title: t("home.courses.a1Title"), text: t("home.courses.a1Text") },
    A2: { title: t("home.courses.a2Title"), text: t("home.courses.a2Text") },
    B1: { title: t("home.courses.b1Title"), text: t("home.courses.b1Text") },
    B2: { title: t("home.courses.b2Title"), text: t("home.courses.b2Text") },
    C1: { title: t("home.courses.c1Title"), text: t("home.courses.c1Text") },
    C2: { title: t("home.courses.c2Title"), text: t("home.courses.c2Text") },
  };

  const painPoints = [t("home.painPoints.p1"), t("home.painPoints.p2"), t("home.painPoints.p3"), t("home.painPoints.p4")];

  const differentiators = [
    { icon: Brain, title: t("home.differentiators.d1Title"), text: t("home.differentiators.d1Text") },
    { icon: Globe2, title: t("home.differentiators.d2Title"), text: t("home.differentiators.d2Text") },
    { icon: Compass, title: t("home.differentiators.d3Title"), text: t("home.differentiators.d3Text") },
  ];

  const lessonStructure = [
    { icon: Target, title: t("home.lessonStructure.s1") },
    { icon: BookOpen, title: t("home.lessonStructure.s2") },
    { icon: Lightbulb, title: t("home.lessonStructure.s3") },
    { icon: Globe2, title: t("home.lessonStructure.s4") },
    { icon: AlertTriangle, title: t("home.lessonStructure.s5") },
    { icon: FileText, title: t("home.lessonStructure.s6") },
    { icon: PenLine, title: t("home.lessonStructure.s7") },
  ];

  const personalization = [
    { icon: Target, title: t("home.personalization.p1Title"), text: t("home.personalization.p1Text") },
    { icon: BarChart3, title: t("home.personalization.p2Title"), text: t("home.personalization.p2Text") },
    { icon: Brain, title: t("home.personalization.p3Title"), text: t("home.personalization.p3Text") },
    { icon: RotateCw, title: t("home.personalization.p4Title"), text: t("home.personalization.p4Text") },
  ];

  const chaosList = [
    t("home.transformation.chaos1"),
    t("home.transformation.chaos2"),
    t("home.transformation.chaos3"),
    t("home.transformation.chaos4"),
  ];

  const klarList = [
    t("home.transformation.klar1"),
    t("home.transformation.klar2"),
    t("home.transformation.klar3"),
    t("home.transformation.klar4"),
  ];

  const faqs = [
    { q: t("home.faq.q1"), a: t("home.faq.a1") },
    { q: t("home.faq.q2"), a: t("home.faq.a2") },
    { q: t("home.faq.q3"), a: t("home.faq.a3") },
    { q: t("home.faq.q4"), a: t("home.faq.a4") },
    { q: t("home.faq.q5"), a: t("home.faq.a5") },
    { q: t("home.faq.q6"), a: t("home.faq.a6") },
  ];

  const heroPreviewCards = [
    { icon: AlertTriangle, title: t("home.hero.preview.mistakesTitle"), text: t("home.hero.preview.mistakesText"), cls: "bg-accent-soft" },
    { icon: Globe2, title: t("home.hero.preview.ukTitle"), text: t("home.hero.preview.ukText"), cls: "bg-info-soft" },
    { icon: Lightbulb, title: t("home.hero.preview.ruleTitle"), text: t("home.hero.preview.ruleText"), cls: "bg-primary-soft" },
    { icon: PenLine, title: t("home.hero.preview.exercisesTitle"), text: t("home.hero.preview.exercisesText"), cls: "bg-secondary" },
  ];

  const howItWorksSteps = [
    { icon: Target, title: t("home.howItWorks.s1Title"), text: t("home.howItWorks.s1Text"), extra: t("home.howItWorks.s1Extra") },
    { icon: BookOpen, title: t("home.howItWorks.s2Title"), text: t("home.howItWorks.s2Text") },
    { icon: TrendingUp, title: t("home.howItWorks.s3Title"), text: t("home.howItWorks.s3Text") },
  ];

  const exampleQuestions = [t("home.example.q1"), t("home.example.q2"), t("home.example.q3")];

  const PrimaryCta = ({ source, size = "lg", className = "" }: { source: string; size?: "lg" | "default"; className?: string }) => (
    <Button
      asChild
      size={size}
      data-cta="placement-test"
      data-cta-source={source}
      className={`bg-gradient-primary hover:opacity-95 shadow-elevated h-12 px-7 text-base ${className}`}
      onClick={() => trackPlacementEvent(PLACEMENT_EVENTS.ctaClicked, { source })}
    >
      <Link to={PLACEMENT_ROUTE}>{t("home.hero.ctaPrimary")} <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
    </Button>
  );

  return (
    <div>
      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container py-12 md:py-16 lg:py-20 grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
          <div className="animate-fade-in order-1">
            <Badge className="bg-accent text-accent-foreground hover:bg-accent gap-1.5 mb-4 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" /> {t("home.badge")}
            </Badge>
            <h1 className={H1}>
              {t("home.hero.title", { highlight: "" }).replace(/\s*\.$/, "").split("{highlight}")[0]}
              <span className="text-gradient">{t("home.hero.titleHighlight")}</span>.
            </h1>
            <p className={`mt-5 max-w-xl ${LEAD}`}>{t("home.hero.subtitle")}</p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <PrimaryCta source="hero" className="w-full sm:w-auto" />
              <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base w-full sm:w-auto bg-card">
                <Link to="/courses">{t("home.hero.ctaSecondary")}</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-3">{t("home.hero.support")}</p>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {[t("home.hero.bullets.b1"), t("home.hero.bullets.b2"), t("home.hero.bullets.b3"), t("home.hero.bullets.b4")].map((u) => (
                <li key={u} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-success shrink-0" /> {u}
                </li>
              ))}
            </ul>
          </div>

          {/* Hero product preview */}
          <div className="relative order-2">
            <div className="absolute -inset-6 bg-gradient-primary opacity-20 blur-3xl rounded-full" aria-hidden />
            <Card className="relative p-6 rounded-2xl shadow-elevated border-0 bg-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-muted-foreground">{t("home.hero.preview.label")}</div>
                  <div className="font-display font-bold text-lg">{t("home.hero.preview.lessonTitle")}</div>
                </div>
                <Badge variant="secondary" className="bg-primary-soft text-primary border-0">B2</Badge>
              </div>

              <div className="rounded-xl bg-secondary p-4 mb-4">
                <div className="text-sm font-semibold mb-1">{t("home.hero.preview.explanationTitle")}</div>
                <div className="text-sm text-muted-foreground">
                  <span className="text-primary font-semibold">um … zu</span> {t("home.hero.preview.explanationRule")}
                </div>
                <div className="text-base mt-2">
                  Ich lerne Deutsch, <span className="text-primary font-semibold">um</span> in Berlin <span className="text-primary font-semibold">zu arbeiten</span>.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left">
                {heroPreviewCards.map((b) => (
                  <div key={b.title} className={`rounded-xl ${b.cls} p-3`}>
                    <b.icon className="h-4 w-4 mb-1.5 text-primary" />
                    <div className="text-xs font-semibold leading-tight">{b.title}</div>
                    <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">{b.text}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 2. PAIN POINTS */}
      <section className="container py-14 md:py-20">
        <div className="max-w-2xl">
          <h2 className={H2}>{t("home.painPoints.title")}</h2>
          <p className={`mt-3 ${LEAD}`}>{t("home.painPoints.subtitle")}</p>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 gap-3.5">
          {painPoints.map((p) => (
            <div key={p} className="rounded-2xl border border-border/70 bg-card px-5 py-4 shadow-soft">
              <p className="text-[1.0625rem] leading-snug text-foreground/85">{p}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 max-w-2xl">
          <p className="font-display font-bold text-xl lg:text-2xl">{t("home.painPoints.reasonTitle")}</p>
          <p className={`mt-2 ${LEAD}`}>{t("home.painPoints.reasonText")}</p>
        </div>
      </section>

      {/* 3. CORE DIFFERENTIATORS */}
      <section className="bg-primary-soft/40 py-14 md:py-20">
        <div className="container">
          <h2 className={`${H2} max-w-3xl`}>{t("home.differentiators.title")}</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {differentiators.map((d) => (
              <Card key={d.title} className="p-7 rounded-2xl border-0 shadow-soft bg-card hover:shadow-elevated transition">
                <div className="h-12 w-12 rounded-xl bg-primary-soft grid place-items-center mb-5">
                  <d.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className={`${H3} mb-2`}>{d.title}</h3>
                <p className="text-muted-foreground">{d.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. REAL LANGUAGE EXAMPLE */}
      <section className="container py-14 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="max-w-xl">
            <h2 className={H2}>{t("home.example.title")}</h2>
            <p className={`mt-4 ${LEAD}`}>{t("home.example.subtitle")}</p>
            <p className="mt-5 text-base text-muted-foreground">{t("home.example.text")}</p>
            <Button asChild variant="ghost" className="mt-4 px-0 text-primary hover:bg-transparent hover:text-primary">
              <Link to="/courses">{t("home.example.cta")} <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>

          <Card className="p-6 md:p-7 rounded-2xl border-0 shadow-elevated bg-card">
            <div className="rounded-xl bg-secondary p-4">
              <div className="text-xs font-semibold text-muted-foreground">{t("home.example.ukLabel")}</div>
              <div className="text-lg mt-1">{t("home.example.ukPhrase")}</div>
            </div>
            <div className="rounded-xl bg-primary-soft p-4 mt-3">
              <div className="text-xs font-semibold text-primary">{t("home.example.deLabel")}</div>
              <div className="text-lg mt-1">
                Ich gehe <span className="text-primary font-semibold">zum</span> Arzt.
              </div>
            </div>
            <div className="mt-5 grid sm:grid-cols-3 gap-2.5">
              {exampleQuestions.map((q) => (
                <div key={q} className="rounded-xl border border-primary/20 bg-card px-3 py-3 text-sm font-semibold text-primary text-center">
                  {q}
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl bg-accent-soft p-4 text-sm">
              <span className="font-semibold">zu + dem = zum</span> {t("home.example.explanationPre")} <span className="font-semibold">zu</span> {t("home.example.explanationPost")}
            </div>
          </Card>
        </div>
      </section>

      {/* 5. LESSON STRUCTURE */}
      <section className="bg-secondary/40 py-14 md:py-20">
        <div className="container">
          <div className="max-w-2xl">
            <h2 className={H2}>{t("home.lessonStructure.title")}</h2>
            <p className={`mt-3 ${LEAD}`}>{t("home.lessonStructure.subtitle")}</p>
          </div>
          <div className="mt-9 grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {lessonStructure.map((s, i) => (
              <Card key={s.title} className="p-4 rounded-2xl border-0 shadow-soft bg-card flex gap-3 items-start">
                <div className="h-9 w-9 shrink-0 rounded-xl bg-primary-soft grid place-items-center">
                  <s.icon className="h-[18px] w-[18px] text-primary" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-muted-foreground">{t("home.lessonStructure.step", { n: i + 1 })}</div>
                  <div className="font-display font-bold text-[15px] leading-snug mt-0.5">{s.title}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section id="how" className="container py-14 md:py-20 scroll-mt-20">
        <div className="max-w-2xl">
          <h2 className={H2}>{t("home.howItWorks.title")}</h2>
          <p className={`mt-3 ${LEAD}`}>{t("home.howItWorks.subtitle")}</p>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {howItWorksSteps.map((s) => (
            <Card key={s.title} className="p-7 rounded-2xl border-0 shadow-soft bg-card hover:shadow-elevated transition">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary grid place-items-center mb-5">
                <s.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className={`${H3} mb-2`}>{s.title}</h3>
              <p className="text-muted-foreground">{s.text}</p>
              {s.extra && <p className="text-sm text-muted-foreground/80 mt-2">{s.extra}</p>}
            </Card>
          ))}
        </div>
        <div className="mt-8">
          <PrimaryCta source="after_how_it_works" />
        </div>
      </section>

      {/* 7. COURSES A1–C2 */}
      <section className="bg-primary-soft/40 py-14 md:py-20">
        <div className="container">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="max-w-2xl">
              <h2 className={H2}>{t("home.courses.title")}</h2>
              <p className={`mt-3 ${LEAD}`}>{t("home.courses.subtitle")}</p>
            </div>
            <Button asChild variant="outline" className="bg-card"><Link to="/courses">{t("home.courses.viewCourses")} <ArrowRight className="ml-1.5 h-4 w-4" /></Link></Button>
          </div>

          <div className="mt-9 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((c) => {
              const showProgress = !!user;
              const stats = getAggregate(getLevelLessonIds(c.level));
              const outcome = levelOutcome[c.level] ?? { title: c.title, text: c.description };
              const status = stats.progress === 100 ? t("home.courses.statusDone") : stats.progress > 0 ? t("home.courses.statusInProgress") : t("home.courses.statusNotStarted");
              const statusClass = stats.progress === 100
                ? "bg-success/15 text-success"
                : stats.progress > 0 ? "bg-primary-soft text-primary" : "bg-secondary text-muted-foreground";
              return (
                <Link key={c.level} to="/courses" className="block group">
                  <Card className="p-6 rounded-2xl border-0 shadow-soft h-full flex flex-col bg-card hover:-translate-y-1 hover:shadow-elevated transition">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`h-14 w-14 rounded-2xl ${levelBadge[c.level]} text-white grid place-items-center font-display font-extrabold text-xl shadow-soft`}>
                        {c.level}
                      </div>
                      {showProgress ? (
                        <Badge variant="secondary" className={`${statusClass} border-0`}>{status}</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-secondary text-muted-foreground border-0">
                          {t("home.courses.lessonsCount", { n: stats.total })}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-xl leading-snug">{outcome.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 mb-5 flex-1">{outcome.text}</p>
                    {showProgress ? (
                      <>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">{t("home.courses.progress")}</span>
                          <span className="font-semibold">{stats.progress}%</span>
                        </div>
                        <Progress value={stats.progress} className="h-2" />
                        <div className="mt-1.5 text-xs text-muted-foreground">{t("home.courses.lessonsCompleted", { completed: stats.completed, total: stats.total })}</div>
                      </>
                    ) : (
                      <span className="inline-flex items-center text-sm font-semibold text-primary">
                        {t("home.courses.viewCourse")} <ArrowRight className="ml-1.5 h-4 w-4" />
                      </span>
                    )}
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. PERSONAL LEARNING SYSTEM */}
      <section className="container py-14 md:py-20">
        <div className="max-w-2xl">
          <h2 className={H2}>{t("home.personalization.title")}</h2>
          <p className={`mt-3 ${LEAD}`}>{t("home.personalization.subtitle")}</p>
        </div>
        <div className="mt-9 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {personalization.map((p) => (
            <Card key={p.title} className="p-6 rounded-2xl border-0 shadow-soft h-full">
              <div className="h-11 w-11 rounded-xl bg-primary-soft grid place-items-center mb-4">
                <p.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display font-bold text-lg">{p.title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{p.text}</p>
            </Card>
          ))}
        </div>
        <p className="text-xs text-muted-foreground/80 mt-5">{t("home.personalization.footnote")}</p>
      </section>

      {/* 9. OKSI */}
      <section className="bg-accent-soft/40 py-14 md:py-20">
        <div className="container grid lg:grid-cols-[45%_1fr] gap-10 lg:gap-14 items-center">
          <OksiPortrait />
          <div className="max-w-xl">
            <h2 className={H2}>{t("home.oksi.greeting")}</h2>
            <p className="mt-4 font-display font-bold text-xl lg:text-2xl leading-snug">{t("home.oksi.lead")}</p>
            <p className={`mt-4 ${LEAD}`}>{t("home.oksi.text")}</p>
            <blockquote className="mt-6 rounded-2xl bg-card border-l-4 border-primary px-5 py-4 shadow-soft">
              <Quote className="h-4 w-4 text-primary mb-1.5" />
              <p className="font-display font-bold text-lg">{t("home.oksi.quote")}</p>
            </blockquote>
            <div className="mt-6">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t("home.oksi.whyTitle")}</div>
              <p className="mt-2 text-base text-muted-foreground">{t("home.oksi.whyText")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. TRANSFORMATION */}
      <section className="container py-14 md:py-20">
        <h2 className={`${H2} max-w-2xl`}>{t("home.transformation.title")}</h2>
        <div className="mt-9 grid md:grid-cols-2 gap-5">
          <Card className="p-7 rounded-2xl border border-border/70 shadow-none bg-secondary/40">
            <div className="font-display font-bold text-lg text-muted-foreground">{t("home.transformation.chaosTitle")}</div>
            <ul className="mt-4 space-y-3">
              {chaosList.map((i) => (
                <li key={i} className="flex gap-3 text-[1.0625rem] text-muted-foreground">
                  <X className="h-5 w-5 shrink-0 mt-0.5 text-destructive/70" /> {i}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-7 rounded-2xl border-0 shadow-elevated bg-card ring-1 ring-primary/15">
            <div className="font-display font-bold text-lg text-primary">{t("home.transformation.klarTitle")}</div>
            <ul className="mt-4 space-y-3">
              {klarList.map((i) => (
                <li key={i} className="flex gap-3 text-[1.0625rem]">
                  <Check className="h-5 w-5 shrink-0 mt-0.5 text-success" /> {i}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* 11. TRY A LESSON CTA */}
      <section className="container pb-14 md:pb-20">
        <Card className="rounded-3xl border-0 bg-primary-soft/60 p-8 md:p-12 shadow-soft flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div className="max-w-xl">
            <h2 className="font-display font-extrabold text-2xl md:text-[2rem] leading-tight">{t("home.tryLesson.title")}</h2>
            <p className="mt-3 text-muted-foreground">{t("home.tryLesson.text")}</p>
          </div>
          <Button asChild size="lg" className="bg-gradient-primary hover:opacity-95 h-12 px-7 text-base shrink-0">
            <Link to="/courses">{t("home.tryLesson.cta")} <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
        </Card>
      </section>

      {/* 12. PRICING */}
      <section id="pricing" className="bg-secondary/40 py-14 md:py-20 scroll-mt-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className={H2}>{t("home.pricing.title")}</h2>
            <p className={`mt-3 ${LEAD}`}>{t("home.pricing.subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 items-start group">
            {plans.map((p) => (
              <Card
                key={p.id}
                className={`relative p-7 rounded-2xl border-0 h-full transition-all duration-300 ease-out hover:scale-[1.03] focus-within:scale-[1.03] active:scale-[1.03] hover:shadow-elevated focus-within:shadow-elevated active:shadow-elevated hover:z-10 focus-within:z-10 active:z-10 ${p.highlight ? "bg-gradient-primary text-primary-foreground shadow-elevated ring-2 ring-primary md:scale-[1.03] hover:scale-[1.04] focus-within:scale-[1.04] active:scale-[1.04]" : "shadow-soft bg-card group-hover:opacity-[0.92] hover:opacity-100 focus-within:opacity-100 active:opacity-100"}`}
              >
                {p.highlight && <Badge className="bg-accent text-accent-foreground mb-3">{t("home.pricing.recommended")}</Badge>}
                <div className="font-display font-bold text-xl">{p.name}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{p.priceM === 0 ? "0 €" : `${p.priceM.toFixed(2)} €`}</span>
                  <span className={`text-sm ${p.highlight ? "opacity-80" : "text-muted-foreground"}`}>{t("home.pricing.perMonth")}</span>
                </div>
                <ul className="mt-5 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className={`h-4 w-4 mt-0.5 shrink-0 ${p.highlight ? "" : "text-success"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className={`w-full mt-6 ${p.highlight ? "bg-background text-primary hover:bg-background/90" : "bg-gradient-primary"}`}>
                  <Link to="/pricing">{p.id === "free" ? t("home.pricing.ctaFree") : t("home.pricing.ctaPaid")}</Link>
                </Button>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-6">{t("home.pricing.footnote")}</p>
        </div>
      </section>

      {/* 13. FAQ */}
      <section id="faq" className="container py-14 md:py-20 scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <h2 className={`${H2} text-center mb-9`}>{t("home.faq.title")}</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`i-${i}`} className="rounded-xl border bg-card px-5">
                <AccordionTrigger className="font-semibold text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 14. FINAL CTA */}
      <section className="container pb-16 md:pb-24">
        <Card className="rounded-3xl border-0 bg-gradient-hero p-10 md:p-14 text-center shadow-soft">
          <h2 className={H2}>{t("home.finalCta.title")}</h2>
          <p className={`mt-4 max-w-xl mx-auto ${LEAD}`}>{t("home.finalCta.subtitle")}</p>
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
            <PrimaryCta source="final_cta" />
            <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base bg-card">
              <Link to="/courses">{t("home.hero.ctaSecondary")}</Link>
            </Button>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">{t("home.finalCta.footnote")}</p>
        </Card>
      </section>
    </div>
  );
};

export default Home;
