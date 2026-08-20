import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Check, BookOpen, Target, TrendingUp, Sparkles, Clock, Globe2, Star, ArrowRight,
  AlertTriangle, Lightbulb, PenLine, Compass, Brain, FileText, RotateCw, BarChart3,
} from "lucide-react";
import { courses, testimonials, plans } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";

const levelBadge: Record<string, string> = {
  A1: "bg-teal-500",
  A2: "bg-blue-500",
  B1: "bg-violet-600",
  B2: "bg-indigo-600",
  C1: "bg-amber-500",
  C2: "bg-blue-900",
};

const valueProps = [
  {
    icon: Compass,
    title: "Знаєш, що вчити далі",
    text: "Рівні, послідовність уроків і персональні рекомендації допомагають рухатися без хаосу.",
  },
  {
    icon: Brain,
    title: "Розумієш, а не зубриш",
    text: "Українські пояснення, правила, приклади та типові помилки допомагають зрозуміти логіку німецької.",
  },
  {
    icon: TrendingUp,
    title: "Бачиш свій прогрес",
    text: "XP, активний час навчання, уроки, квізи та тижневі цілі показують твій реальний прогрес.",
  },
];

const lessonStructure = [
  { icon: Target, title: "Мета уроку", text: "Що саме ти навчишся робити" },
  { icon: BookOpen, title: "Пояснення", text: "Граматика простою українською" },
  { icon: Lightbulb, title: "Правила", text: "Коротко й по суті" },
  { icon: Globe2, title: "Для україномовних", text: "Порівняння німецької та української" },
  { icon: AlertTriangle, title: "Типові помилки", text: "Що найчастіше плутають" },
  { icon: FileText, title: "Коротко про головне", text: "Швидке повторення перед практикою" },
  { icon: PenLine, title: "15 вправ", text: "Від простіших до складніших" },
];

const personalization = [
  { icon: Target, title: "Особисті цілі", text: "Встановлюй щоденну ціль у хвилинах та тижневу ціль у XP." },
  { icon: BarChart3, title: "Реальний прогрес", text: "Бачиш завершені уроки, квізи та активний час навчання." },
  { icon: Brain, title: "Рекомендації", text: "Платформа підказує, що варто продовжити, повторити або вивчити далі." },
  { icon: RotateCw, title: "Робота над помилками", text: "Після Quiz бачиш слабкі місця та можеш повторити саме помилки." },
];

const faqs = [
  { q: "Чи підходить платформа для початківців?", a: "Так. Ми починаємо з абсолютного нуля — рівень A1, алфавіт і вимова. Усі пояснення українською мовою." },
  { q: "Як визначити свій рівень?", a: "Пройди короткий тест на визначення рівня або обери рівень A1–C2 самостійно у розділі «Курси»." },
  { q: "Чи можу я навчатися у власному темпі?", a: "Так. Немає розкладу й дедлайнів: ти сама позначаєш уроки як розпочаті та завершені й задаєш щоденну й тижневу цілі." },
  { q: "Що входить у безкоштовний доступ?", a: "Базові лекції A1, тест на визначення рівня, частина вправ і доступ до словника." },
  { q: "Як працює підписка?", a: "Підписка помісячна або річна й відкриває матеріали відповідно до обраного тарифу — Klar Plus або Klar Premium." },
  { q: "Чи можу я скасувати підписку?", a: "Так, будь-коли у профілі — без пояснень. Доступ збережеться до кінця оплаченого періоду." },
  { q: "Чи є мобільний застосунок?", a: "Окремого застосунку немає. Платформа повністю адаптована під телефон і працює прямо в браузері." },
];

const Home = () => {
  const { user } = useAuth();
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  return (
    <div>
      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <Badge className="bg-accent text-accent-foreground hover:bg-accent gap-1.5 mb-5 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" /> Німецька A1–C2 українською
            </Badge>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Німецька без хаосу.
              <span className="block text-gradient mt-2">Зрозумій систему — і почни користуватися нею.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl">
              Граматика, словник, приклади, типові помилки та практика — пояснені українською й зібрані в одному логічному шляху від A1 до C2.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-95 shadow-elevated h-12 px-7 text-base">
                <Link to="/signup">Почати безкоштовно <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base">
                <Link to="/courses">Подивитися курси</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> Пояснення українською</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> Рівні A1–C2</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> 15 вправ після кожного уроку</div>
            </div>
          </div>

          {/* 2. HERO PRODUCT PREVIEW */}
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
            <Card className="relative p-6 rounded-2xl shadow-elevated border-0 bg-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-muted-foreground">Так виглядає урок</div>
                  <div className="font-display font-bold text-lg">Infinitivkonstruktionen</div>
                </div>
                <Badge variant="secondary" className="bg-primary-soft text-primary border-0">B2</Badge>
              </div>

              <div className="rounded-xl bg-secondary p-4 mb-4">
                <div className="text-sm font-semibold mb-1">Пояснення</div>
                <div className="text-sm text-muted-foreground">
                  <span className="text-primary font-semibold">um … zu</span> = мета, коли суб’єкт однаковий
                </div>
                <div className="text-base mt-2">
                  Ich lerne Deutsch, <span className="text-primary font-semibold">um</span> in Berlin <span className="text-primary font-semibold">zu arbeiten</span>.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left">
                {[
                  { icon: AlertTriangle, title: "Типові помилки", text: "Що часто плутають", cls: "bg-accent-soft" },
                  { icon: Globe2, title: "Для україномовних", text: "Порівняння логіки мов", cls: "bg-info-soft" },
                  { icon: Lightbulb, title: "Правило", text: "Коротко й по суті", cls: "bg-primary-soft" },
                  { icon: PenLine, title: "15 вправ", text: "Одразу закріпити", cls: "bg-secondary" },
                ].map((b) => (
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

      {/* 3. CORE VALUE PROPOSITION */}
      <section className="container py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold">Не просто уроки — зрозуміла система навчання</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {valueProps.map((v) => (
            <Card key={v.title} className="p-7 rounded-2xl border-0 shadow-soft hover:shadow-elevated transition">
              <div className="h-12 w-12 rounded-xl bg-primary-soft grid place-items-center mb-5">
                <v.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">{v.title}</h3>
              <p className="text-muted-foreground">{v.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how" className="bg-primary-soft/40 py-16 md:py-24 scroll-mt-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold">Як це працює?</h2>
            <p className="text-muted-foreground mt-3">Три прості кроки — від першого слова до впевненої німецької.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "1. Обери свій рівень", text: "Пройди короткий тест або обери рівень A1–C2 самостійно.", extra: "Ми допоможемо сформувати зрозумілий старт." },
              { icon: BookOpen, title: "2. Вчися системно", text: "Уроки з поясненнями українською, прикладами, типовими помилками та 15 вправами для закріплення." },
              { icon: TrendingUp, title: "3. Бачиш свій прогрес", text: "Слідкуй за уроками, квізами, XP, активним часом навчання та персональними рекомендаціями." },
            ].map((s) => (
              <Card key={s.title} className="p-7 rounded-2xl border-0 shadow-soft bg-card hover:shadow-elevated transition">
                <div className="h-12 w-12 rounded-xl bg-gradient-primary grid place-items-center mb-5">
                  <s.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">{s.title}</h3>
                <p className="text-muted-foreground">{s.text}</p>
                {s.extra && <p className="text-sm text-muted-foreground/80 mt-2">{s.extra}</p>}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. COURSE / LEVEL OVERVIEW */}
      <section className="container py-16 md:py-24">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold">Усе для вивчення в одному місці</h2>
            <p className="text-muted-foreground mt-2">
              Навчальний шлях від A1 до C2 — граматика, словник, практика та прогрес в одному місці.
            </p>
          </div>
          <Button asChild variant="outline"><Link to="/courses">Усі курси <ArrowRight className="ml-1.5 h-4 w-4"/></Link></Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c) => {
            const showProgress = !!user;
            const status = c.progress === 100 ? "Завершено" : c.progress > 0 ? "У процесі" : "Не розпочато";
            const statusClass = c.progress === 100
              ? "bg-success/15 text-success"
              : c.progress > 0 ? "bg-primary-soft text-primary" : "bg-secondary text-muted-foreground";
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
                        {c.lessons} лекцій
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-xl">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 mb-5 flex-1">{c.description}</p>
                  {showProgress ? (
                    <>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">{c.lessons} лекцій</span>
                        <span className="font-semibold text-primary">{c.progress}%</span>
                      </div>
                      <Progress value={c.progress} className="h-2" />
                    </>
                  ) : (
                    <span className="inline-flex items-center text-sm font-semibold text-primary">
                      Переглянути курс <ArrowRight className="ml-1.5 h-4 w-4" />
                    </span>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6. LESSON STRUCTURE */}
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold">Один урок — одна зрозуміла структура</h2>
            <p className="text-muted-foreground mt-3">
              Ти завжди знаєш, що на тебе чекає: пояснення, приклади, практика й повторення.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lessonStructure.map((s, i) => (
              <Card key={s.title} className="p-5 rounded-2xl border-0 shadow-soft bg-card flex gap-3 items-start">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-primary-soft grid place-items-center">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-muted-foreground">Крок {i + 1}</div>
                  <div className="font-display font-bold">{s.title}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{s.text}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PROGRESS & PERSONALIZATION */}
      <section className="container py-16 md:py-24">
        <div className="max-w-2xl mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold">Навчайся у своєму темпі — ми допоможемо не загубитися</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
        <p className="text-xs text-muted-foreground mt-6">
          Рекомендації формуються за простими правилами на основі твоєї активності — без штучного інтелекту.
        </p>
      </section>

      {/* 8. PRICING */}
      <section id="pricing" className="bg-primary-soft/40 py-16 md:py-24 scroll-mt-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold">Прості та зрозумілі тарифи</h2>
            <p className="text-muted-foreground mt-3">Почни безкоштовно. Перейди на Plus або Premium, коли будеш готова.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 items-start">
            {plans.map((p) => (
              <Card key={p.id} className={`p-7 rounded-2xl border-0 h-full ${p.highlight ? "bg-gradient-primary text-primary-foreground shadow-elevated ring-2 ring-primary md:scale-[1.03]" : "shadow-soft bg-card"}`}>
                {p.highlight && <Badge className="bg-accent text-accent-foreground mb-3">Рекомендовано</Badge>}
                <div className="font-display font-bold text-xl">{p.name}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{p.priceM === 0 ? "0 €" : `${p.priceM.toFixed(2)} €`}</span>
                  <span className={`text-sm ${p.highlight ? "opacity-80" : "text-muted-foreground"}`}>/міс</span>
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
                  <Link to="/pricing">{p.id === "free" ? "Почати" : "Обрати"}</Link>
                </Button>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-6">
            Пункти з позначкою «(у розробці)» ще готуються й поки не доступні.
          </p>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="container py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold">Що кажуть учні</h2>
          <Badge variant="outline" className="mt-4">Демонстраційні приклади — справжні відгуки з’являться згодом</Badge>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <Card key={i} className="p-6 rounded-2xl border-0 shadow-soft">
              <div className="flex gap-0.5 text-accent mb-3">{[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}</div>
              <p className="text-foreground/90">«{t.text}»</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-bold">{t.name.charAt(0)}</div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">Рівень {t.level}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 10. FAQ */}
      <section id="faq" className="bg-secondary/40 py-16 md:py-24 scroll-mt-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-center mb-10">Часті питання</h2>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`i-${i}`} className="rounded-xl border bg-card px-5">
                  <AccordionTrigger className="font-semibold text-left">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="container py-16 md:py-24">
        <Card className="rounded-3xl border-0 bg-primary-soft/60 p-10 md:p-14 text-center shadow-soft">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold">Готова зробити німецьку зрозумілішою?</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Почни з першого уроку безкоштовно й рухайся у своєму темпі.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-gradient-primary hover:opacity-95 h-12 px-7 text-base">
              <Link to="/signup">Почати безкоштовно <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base bg-card">
              <Link to="/courses">Переглянути курси</Link>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> Вчись будь-коли</span>
            <span className="flex items-center gap-1.5"><Globe2 className="h-4 w-4 text-info" /> Українською</span>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Home;
