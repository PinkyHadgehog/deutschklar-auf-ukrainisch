import { useMemo, useRef, useState } from "react";
import LessonStatusBadge from "@/components/lesson/LessonStatusBadge";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { courses, grammarCategories, type Level } from "@/data/mock";
import {
  getAggregate,
  getLevelLessonIds,
  getTopicLessonIds,
  useProgressVersion,
} from "@/lib/progressAggregate";
import { Lock, ArrowRight, BookOpen, Search, X } from "lucide-react";


const LEVELS: Array<"all" | Level> = ["all", "A1", "A2", "B1", "B2", "C1", "C2"];

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");

const Courses = () => {
  const [level, setLevel] = useState<"all" | Level>("all");
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<"all" | string>("all");
  const lessonsRef = useRef<HTMLElement | null>(null);
  useProgressVersion();
  const filteredCourses = level === "all" ? courses : courses.filter((c) => c.level === level);


  const openLevel = (l: Level) => {
    setLevel(l);
    requestAnimationFrame(() => {
      lessonsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const q = norm(query.trim());

  const topicsByLevel = useMemo(() => {
    if (level === "all") return [];
    return grammarCategories
      .map((cat) => {
        const topics = cat.topics
          .filter((t) => t.level === level)
          .map((t) => {
            const sub = t.sub?.filter((s) => !q || norm(s.title).includes(q)) ?? undefined;
            const topicMatches =
              !q || norm(t.title).includes(q) || norm(t.titleDe).includes(q);
            const hasSubMatch = q && t.sub && sub && sub.length > 0;
            if (!q || topicMatches || hasSubMatch) {
              return { ...t, sub: topicMatches ? t.sub : sub };
            }
            return null;
          })
          .filter(Boolean) as typeof cat.topics;
        return { ...cat, topics };
      })
      .filter((cat) => cat.topics.length > 0)
      .filter((cat) => categoryId === "all" || cat.id === categoryId);
  }, [level, q, categoryId]);

  const availableCategories = useMemo(() => {
    if (level === "all") return [];
    return grammarCategories.filter((cat) =>
      cat.topics.some((t) => t.level === level),
    );
  }, [level]);

  const totalLessons = topicsByLevel.reduce(
    (acc, cat) => acc + cat.topics.reduce((a, t) => a + (t.sub?.length || t.lessons), 0),
    0,
  );

  return (
    <div className="container py-10 md:py-14">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold">Курси за рівнями</h1>
        <p className="text-muted-foreground mt-2">
          Структуровані програми від A1 до C2. Обери рівень — і одразу побачиш усі теми, підкатегорії та уроки.
        </p>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`px-4 h-9 rounded-full text-sm font-semibold border transition ${
              level === l
                ? "bg-gradient-primary text-primary-foreground border-transparent"
                : "bg-background hover:bg-muted border-input"
            }`}
          >
            {l === "all" ? "Усі рівні" : l}
          </button>
        ))}
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((c) => {
          const stats = getAggregate(getLevelLessonIds(c.level));
          return (
          <Card
            key={c.level}
            className="p-6 rounded-2xl border-0 shadow-soft group hover:-translate-y-1 transition relative overflow-hidden"
          >
            {c.premium && (
              <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground gap-1">
                <Lock className="h-3 w-3" /> Premium
              </Badge>
            )}
            <div
              className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${c.color} grid place-items-center text-white font-display font-extrabold text-2xl mb-4 shadow-soft`}
            >
              {c.level}
            </div>
            <h3 className="font-display font-bold text-xl">{c.title}</h3>
            <p className="text-sm text-muted-foreground mt-1.5">{c.description}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{stats.total} лекцій</span>
              <span className="font-semibold text-primary">{stats.progress}%</span>
            </div>
            <Progress value={stats.progress} className="h-1.5 mt-2" />
            <div className="mt-1.5 text-xs text-muted-foreground">
              {stats.completed} з {stats.total} уроків завершено
            </div>
            <Button
              variant="outline"
              className="w-full mt-5"
              onClick={() => openLevel(c.level)}
            >
              {stats.progress > 0 ? "Продовжити" : "Почати"}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Card>
          );
        })}
      </div>


      {level !== "all" && (
        <section ref={lessonsRef} className="mt-12 scroll-mt-24">
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold">
                Уроки та підкатегорії — рівень {level}
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {topicsByLevel.length} категорій · {totalLessons} уроків
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/grammar">Перейти до граматики <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="mt-5 flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Пошук теми чи підкатегорії… (напр. Präsens, артиклі, Konjunktiv)"
                className="pl-9 pr-9 h-11 rounded-xl"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Очистити пошук"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-muted"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryId("all")}
                className={`px-3 h-9 rounded-full text-xs font-semibold border transition ${
                  categoryId === "all"
                    ? "bg-gradient-primary text-primary-foreground border-transparent"
                    : "bg-background hover:bg-muted border-input"
                }`}
              >
                Усі категорії
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`px-3 h-9 rounded-full text-xs font-semibold border transition ${
                    categoryId === cat.id
                      ? "bg-gradient-primary text-primary-foreground border-transparent"
                      : "bg-background hover:bg-muted border-input"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>

          {topicsByLevel.length === 0 ? (
            <Card className="mt-6 p-8 rounded-2xl border-0 shadow-soft text-center text-muted-foreground">
              {q || categoryId !== "all"
                ? `Нічого не знайдено для «${query}» на рівні ${level}. Спробуй інший запит чи категорію.`
                : `Для рівня ${level} ще немає опублікованих тем. Зазирни пізніше.`}
            </Card>
          ) : (
            <div className="mt-6 grid md:grid-cols-2 gap-5">
              {topicsByLevel.map((cat) => (
                <Card key={cat.id} className="p-6 rounded-2xl border-0 shadow-soft">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-9 w-9 rounded-xl bg-primary-soft text-primary grid place-items-center">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg leading-tight">{cat.title}</h3>
                      <div className="text-xs text-muted-foreground">{cat.titleDe}</div>
                    </div>
                  </div>

                  <Accordion
                    key={q ? `q-${q}` : "noq"}
                    type="multiple"
                    className="w-full"
                    defaultValue={q ? cat.topics.map((t) => t.slug) : []}
                  >
                    {cat.topics.map((topic) => {
                      const topicStats = getAggregate(getTopicLessonIds(topic.slug));
                      return (
                      <AccordionItem key={topic.slug} value={topic.slug}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex flex-1 items-center justify-between gap-3 pr-2">
                            <div className="text-left min-w-0">
                              <div className="font-semibold text-sm">{topic.title}</div>
                              <div className="text-xs text-muted-foreground">{topic.titleDe}</div>
                              <div className="mt-2 flex items-center gap-2">
                                <Progress value={topicStats.progress} className="h-1.5 w-28" />
                                <span className="text-xs font-semibold text-primary">{topicStats.progress}%</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {topic.premium && (
                                <Badge variant="secondary" className="gap-1">
                                  <Lock className="h-3 w-3" /> Premium
                                </Badge>
                              )}
                              <Badge variant="outline">{topicStats.total} ур.</Badge>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div className="text-xs text-muted-foreground">
                              {topicStats.completed} з {topicStats.total} уроків завершено
                            </div>
                            <button
                              type="button"
                              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition"
                              onClick={() => {
                                const nowSaved = toggleSavedItem("topic", `grammar:${topic.slug}`, {
                                  kind: "grammar",
                                  topicId: topic.slug,
                                  title: topic.titleDe,
                                  subtitle: topic.title,
                                  level: topic.level,
                                  count: topicStats.total,
                                });
                                toast(nowSaved ? "Тему збережено" : "Видалено зі збереженого");
                              }}
                            >
                              <Bookmark className={`h-3.5 w-3.5 ${savedTopicIds.has(`grammar:${topic.slug}`) ? "fill-primary text-primary" : ""}`} />
                              {savedTopicIds.has(`grammar:${topic.slug}`) ? "Збережено" : "Зберегти тему"}
                            </button>
                          </div>


                          {topic.sub && topic.sub.length > 0 ? (
                            <ul className="grid gap-1.5">
                              {topic.sub.map((s) => (
                                <li key={s.slug}>
                                  <Link
                                    to={`/lesson/${s.slug}`}
                                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition"
                                  >
                                    <span className="truncate">{s.title}</span>
                                    <span className="flex items-center gap-2 shrink-0">
                                      <LessonStatusBadge lessonId={s.slug} />
                                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <Button asChild size="sm" variant="outline">
                              <Link to={`/lesson/${topic.slug}`}>
                                Відкрити урок <ArrowRight className="ml-1.5 h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                      );
                    })}

                  </Accordion>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Courses;
