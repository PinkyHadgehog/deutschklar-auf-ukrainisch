import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, BookOpen, Target, TrendingUp, Sparkles, Clock, Globe2, Star, ArrowRight } from "lucide-react";
import { courses, testimonials, plans } from "@/data/mock";

const Home = () => {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <Badge className="bg-accent text-accent-foreground hover:bg-accent gap-1.5 mb-5 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" /> A1 → C2 українською
            </Badge>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Вивчай німецьку <span className="text-gradient">зрозуміло</span>, системно та у своєму темпі.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl">
              Курси від A1 до C2, граматика, слова, вправи та особистий прогрес — усе в одному місці. Пояснення українською, приклади німецькою.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-95 shadow-elevated h-12 px-7 text-base">
                <Link to="/signup">Почати безкоштовно <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base">
                <Link to="/courses">Переглянути курси</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> Рівні A1–C2</div>
              <div className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-info" /> Пояснення українською</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Вчись будь-коли</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
            <Card className="relative p-6 rounded-2xl shadow-elevated border-0 bg-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-muted-foreground">Сьогодні</div>
                  <div className="font-display font-bold text-lg">Adjektivdeklination</div>
                </div>
                <Badge variant="secondary" className="bg-primary-soft text-primary border-0">B1</Badge>
              </div>
              <div className="rounded-xl bg-secondary p-4 mb-4">
                <div className="text-sm font-semibold mb-1">Beispiel</div>
                <div className="text-base">Der <span className="text-primary font-semibold">große</span> Mann liest die <span className="text-primary font-semibold">interessante</span> Zeitung.</div>
                <div className="text-sm text-muted-foreground mt-1">Високий чоловік читає цікаву газету.</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-primary-soft p-3"><div className="font-bold text-primary text-lg">12</div>правил</div>
                <div className="rounded-lg bg-accent-soft p-3"><div className="font-bold text-accent-foreground text-lg">28</div>прикладів</div>
                <div className="rounded-lg bg-info-soft p-3"><div className="font-bold text-info text-lg">8</div>вправ</div>
              </div>
            </Card>
            <Card className="absolute -bottom-6 -left-4 p-3 px-4 shadow-elevated border-0 hidden md:flex items-center gap-2 animate-float">
              <div className="h-8 w-8 rounded-full bg-success/15 grid place-items-center"><Check className="h-4 w-4 text-success" /></div>
              <div className="text-sm"><b>+12</b> нових слів сьогодні</div>
            </Card>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="container py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold">Як це працює?</h2>
          <p className="text-muted-foreground mt-3">Три прості кроки — від першого слова до впевненої розмови.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Target, title: "1. Обери рівень", text: "Пройди короткий тест або обери A1–C2 самостійно. Ми підлаштуємо програму." },
            { icon: BookOpen, title: "2. Вчи лекції", text: "Граматика з прикладами, аудіо, вправи. Маленькі кроки — стабільний результат." },
            { icon: TrendingUp, title: "3. Бачи прогрес", text: "Особистий кабінет, серії, квізи, рекомендації — мотивація щодня." },
          ].map((s, i) => (
            <Card key={i} className="p-7 rounded-2xl border-0 shadow-soft hover:shadow-elevated transition">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary grid place-items-center mb-5">
                <s.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">{s.title}</h3>
              <p className="text-muted-foreground">{s.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* PREVIEW AREAS */}
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold">Усе для вивчення в одному місці</h2>
              <p className="text-muted-foreground mt-2">Курси, граматика, словник і тести.</p>
            </div>
            <Button asChild variant="outline"><Link to="/courses">Усі курси <ArrowRight className="ml-1.5 h-4 w-4"/></Link></Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.slice(0, 3).map((c) => (
              <Card key={c.level} className="p-6 rounded-2xl border-0 shadow-soft group hover:-translate-y-1 transition">
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${c.color} grid place-items-center text-primary-foreground font-display font-extrabold text-2xl mb-4`}>{c.level}</div>
                <h3 className="font-display font-bold text-xl">{c.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 mb-4">{c.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{c.lessons} лекцій</span>
                  <span className="font-semibold text-primary">{c.progress}%</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="container py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold">Прості та зрозумілі тарифи</h2>
          <p className="text-muted-foreground mt-3">Почни безкоштовно. Перейди на Plus або Premium, коли будеш готова.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((p) => (
            <Card key={p.id} className={`p-7 rounded-2xl border-0 ${p.highlight ? "bg-gradient-primary text-primary-foreground shadow-elevated ring-2 ring-primary scale-[1.02]" : "shadow-soft"}`}>
              {p.highlight && <Badge className="bg-accent text-accent-foreground mb-3">Рекомендовано</Badge>}
              <div className="font-display font-bold text-xl">{p.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">{p.priceM === 0 ? "0 €" : `${p.priceM.toFixed(2)} €`}</span>
                <span className={`text-sm ${p.highlight ? "opacity-80" : "text-muted-foreground"}`}>/міс</span>
              </div>
              <ul className="mt-5 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2"><Check className={`h-4 w-4 mt-0.5 shrink-0 ${p.highlight ? "" : "text-success"}`} />{f}</li>
                ))}
              </ul>
              <Button asChild className={`w-full mt-6 ${p.highlight ? "bg-background text-primary hover:bg-background/90" : "bg-gradient-primary"}`}>
                <Link to="/pricing">{p.id === "free" ? "Почати" : "Обрати"}</Link>
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-center mb-12">Що кажуть учні</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <Card key={i} className="p-6 rounded-2xl border-0 shadow-soft">
                <div className="flex gap-0.5 text-accent mb-3">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
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
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-center mb-10">Часті питання</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {[
              { q: "Чи підходить платформа для початківців?", a: "Так, ми починаємо з абсолютного нуля — A1. Усі пояснення українською мовою." },
              { q: "Чи можу я скасувати підписку будь-коли?", a: "Так. Підписку можна скасувати у профілі — без додаткових пояснень. Доступ збережеться до кінця оплаченого періоду." },
              { q: "Чи є мобільний застосунок?", a: "Платформа повністю адаптована під телефон. Окремий застосунок з'явиться найближчим часом." },
              { q: "Чи отримаю сертифікат після завершення?", a: "На тарифі Premium ви отримуєте сертифікат про завершення курсу A1–C2." },
              { q: "Які способи оплати?", a: "Картки Visa / Mastercard, SEPA, PayPal, Apple Pay та Google Pay." },
            ].map((f, i) => (
              <AccordionItem key={i} value={`i-${i}`} className="rounded-xl border bg-card px-5">
                <AccordionTrigger className="font-semibold text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
};

export default Home;
