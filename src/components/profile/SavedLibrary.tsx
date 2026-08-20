import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Heart, Bookmark, BookOpen, Layers, RotateCw, Play, ArrowRight, Search, ChevronDown } from "lucide-react";
import { vocabThemes, type Level } from "@/data/mock";
import { removeSavedItem, useSavedItems, type SavedItem } from "@/lib/savedItems";
import { getLessonProgressEntry, statusToProgress, type LessonStatus } from "@/lib/lessonProgress";
import { useProgressVersion } from "@/lib/progressAggregate";
import {
  filterSavedWords,
  groupSavedWordsByTopic,
  savedWordDe,
  savedWordTopicId,
  savedWordsLabel,
  topicCountLabel,
  wordCountLabel,
} from "@/lib/savedWordGroups";


const LEVELS: Array<"all" | Level> = ["all", "A1", "A2", "B1", "B2", "C1", "C2"];

const str = (v: unknown) => (typeof v === "string" ? v : undefined);
const stripArtikel = (de: string) => de.replace(/^\s*(der|die|das)\s+/i, "");

const statusText: Record<LessonStatus, string> = {
  not_started: "Не розпочато",
  started: "У процесі",
  completed: "Завершено",
};

const ctaText: Record<LessonStatus, string> = {
  not_started: "Почати урок",
  started: "Продовжити",
  completed: "Повторити",
};

const EmptyState = ({ text, hint, ctaLabel, to }: { text: string; hint: string; ctaLabel: string; to: string }) => (
  <div className="py-10 text-center">
    <div className="text-2xl">♡</div>
    <div className="mt-2 font-semibold">{text}</div>
    <div className="mt-1 text-sm text-muted-foreground">{hint}</div>
    <Button asChild className="mt-4 bg-gradient-primary">
      <Link to={to}>{ctaLabel}</Link>
    </Button>
  </div>
);

const Row = ({
  icon,
  title,
  subtitle,
  right,
  action,
  onRemove,
  onClick,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
  action?: React.ReactNode;
  onRemove: () => void;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 rounded-xl border border-border/70 bg-card px-3 py-2.5 transition hover:border-primary/40 ${onClick ? "cursor-pointer" : ""}`}
  >
    <div className="shrink-0 text-primary">{icon}</div>
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <div className="truncate text-sm font-semibold">{title}</div>
        {right}
      </div>
      {subtitle && <div className="truncate text-xs text-muted-foreground">{subtitle}</div>}
    </div>
    <div className="flex shrink-0 items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      {action}
      <button
        type="button"
        aria-label="Видалити зі збереженого"
        onClick={(e) => { e.stopPropagation(); onRemove(); toast("Видалено зі збереженого"); }}
        className="p-1.5 text-destructive/80 hover:text-destructive"
      >
        <Heart className="h-4 w-4 fill-current" />
      </button>
    </div>
  </div>
);

const SavedLibrary = ({ variant = "card" }: { variant?: "card" | "page" }) => {
  const saved = useSavedItems();
  const navigate = useNavigate();
  useProgressVersion();
  const [tab, setTab] = useState<"words" | "lessons" | "topics">("words");
  const [level, setLevel] = useState<"all" | Level>("all");

  const themeTitle = (id?: string) => vocabThemes.find((t) => t.id === id)?.titleDe ?? id ?? "";

  const filterByLevel = (items: SavedItem[]) =>
    level === "all" ? items : items.filter((i) => str(i.meta?.level) === level);

  const lessons = useMemo(() => filterByLevel(saved.lessons), [saved.lessons, level]);
  const topics = useMemo(() => filterByLevel(saved.topics), [saved.topics, level]);

  // --- Слова: search + CEFR filter + topic grouping ---
  const [wordQuery, setWordQuery] = useState("");
  const [wordLevel, setWordLevel] = useState<"all" | Level>("all");
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  const allTopicCount = useMemo(
    () => new Set(saved.words.map(savedWordTopicId)).size,
    [saved.words]
  );
  const visibleWords = useMemo(
    () => filterSavedWords(saved.words, wordQuery, wordLevel),
    [saved.words, wordQuery, wordLevel]
  );
  const groups = useMemo(() => groupSavedWordsByTopic(visibleWords), [visibleWords]);

  const scopeParams = () => {
    const p = new URLSearchParams({ tab: "flash", saved: "1" });
    if (wordLevel !== "all") p.set("savedLevel", wordLevel);
    if (wordQuery.trim()) p.set("savedQuery", wordQuery.trim());
    return p;
  };
  const reviewAllUrl = `/vocab?${scopeParams().toString()}`;
  const topicReviewUrl = (topicId: string) => {
    const p = scopeParams();
    p.set("topic", topicId);
    return `/vocab?${p.toString()}`;
  };


  const tabs = [
    { id: "words" as const, label: "Слова", count: saved.words.length },
    { id: "lessons" as const, label: "Уроки", count: saved.lessons.length },
    { id: "topics" as const, label: "Теми", count: saved.topics.length },
  ];

  return (
    <Card
      className={
        variant === "page"
          ? "p-6 rounded-2xl border-0 shadow-soft"
          : "p-6 rounded-2xl border-0 shadow-soft md:col-span-3"
      }
    >
      {variant === "card" && (
        <>
          <div className="font-display font-bold flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-primary" /> Збережене
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Слова, уроки та теми, які ти хочеш повторити пізніше.
          </p>
        </>
      )}

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              tab === t.id
                ? "bg-gradient-primary text-primary-foreground shadow-soft"
                : "bg-secondary/70 text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label} <span className="opacity-80">{t.count}</span>
          </button>
        ))}
      </div>

      {tab !== "words" && (saved.lessons.length > 0 || saved.topics.length > 0) && (
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`shrink-0 rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                level === l ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {l === "all" ? "Усі" : l}
            </button>
          ))}
        </div>
      )}

      {/* WORDS */}
      {tab === "words" && (
        <div className="mt-4">
          {saved.words.length === 0 ? (
            <EmptyState
              text="Тут поки немає збережених слів"
              hint="Зберігай слова, які хочеш повторити пізніше."
              ctaLabel="Перейти до словника"
              to="/vocab"
            />
          ) : (
            <>
              <div className="text-sm text-muted-foreground">
                Збережено {savedWordsLabel(saved.words.length)} у {topicCountLabel(allTopicCount)}
              </div>

              <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={wordQuery}
                    onChange={(e) => setWordQuery(e.target.value)}
                    placeholder="Пошук у збережених словах..."
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {LEVELS.map((l) => (
                    <button
                      key={l}
                      onClick={() => setWordLevel(l)}
                      className={`shrink-0 rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                        wordLevel === l
                          ? "border-primary bg-primary-soft text-primary"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {l === "all" ? "Усі" : l}
                    </button>
                  ))}
                </div>
              </div>

              {visibleWords.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="font-semibold">Нічого не знайдено</div>
                  <div className="mt-1 text-sm text-muted-foreground">Спробуй інше слово або зміни фільтр.</div>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => { setWordQuery(""); setWordLevel("all"); }}
                  >
                    Очистити фільтри
                  </Button>
                </div>
              ) : (
                <>
                  <Button className="mt-3 bg-gradient-primary" onClick={() => navigate(reviewAllUrl)}>
                    <RotateCw className="h-4 w-4 mr-1.5" /> Повторити всі слова
                  </Button>

                  <div className="mt-3 space-y-2">
                    {groups.map((g) => {
                      const open = openTopic === g.topicId;
                      return (
                        <div key={g.topicId} className="overflow-hidden rounded-xl border border-border/70 bg-card">
                          <button
                            type="button"
                            onClick={() => setOpenTopic(open ? null : g.topicId)}
                            className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition ${
                              open ? "bg-primary-soft/50" : "hover:bg-muted/50"
                            }`}
                          >
                            <span className="text-base">{g.emoji}</span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold">{g.title}</span>
                              <span className="block text-xs text-muted-foreground">{wordCountLabel(g.words.length)}</span>
                            </span>
                            {g.level && <Badge variant="outline" className="shrink-0 text-[10px]">{g.level}</Badge>}
                            <span className="shrink-0 text-sm font-semibold text-primary">{g.words.length}</span>
                            <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
                          </button>

                          {open && (
                            <div className="space-y-2 border-t border-border/60 p-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(topicReviewUrl(g.topicId))}
                              >
                                <Play className="h-3.5 w-3.5 mr-1" /> Повторити тему
                              </Button>
                              {g.words.map((w) => {
                                const de = savedWordDe(w);
                                const artikel = str(w.meta?.artikel);
                                const plural = str(w.meta?.plural);
                                return (
                                  <Row
                                    key={w.id}
                                    icon={<BookOpen className="h-4 w-4" />}
                                    title={
                                      <span>
                                        {artikel && <span className="mr-1 text-primary">{artikel}</span>}
                                        {stripArtikel(de)}
                                      </span>
                                    }
                                    right={str(w.meta?.level) ? <Badge variant="outline" className="shrink-0 text-[10px]">{str(w.meta?.level)}</Badge> : undefined}
                                    subtitle={
                                      <>
                                        {str(w.meta?.uk)}
                                        {plural && plural !== "—" ? ` · Pl.: ${plural}` : ""}
                                      </>
                                    }
                                    action={
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          navigate(
                                            `/vocab?tab=flash&topic=${encodeURIComponent(g.topicId)}&word=${encodeURIComponent(de)}`
                                          )
                                        }
                                      >
                                        Повторити
                                      </Button>
                                    }
                                    onRemove={() => removeSavedItem("word", w.id)}
                                  />
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}


      {/* LESSONS */}
      {tab === "lessons" && (
        <div className="mt-4">
          {saved.lessons.length === 0 ? (
            <EmptyState
              text="Тут поки немає збережених уроків"
              hint="Зберігай важливі уроки, щоб швидко повертатися до них."
              ctaLabel="Перейти до курсів"
              to="/courses"
            />
          ) : lessons.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Немає збережених уроків цього рівня.</div>
          ) : (
            <div className="space-y-2">
              {lessons.map((l) => {
                const entry = getLessonProgressEntry(l.id);
                const pct = statusToProgress(entry.status);
                return (
                  <Row
                    key={l.id}
                    icon={<Layers className="h-4 w-4" />}
                    title={str(l.meta?.title) ?? l.id}
                    right={<Badge variant="outline" className="shrink-0 text-[10px]">{str(l.meta?.level) ?? "—"}</Badge>}
                    subtitle={
                      <>
                        {str(l.meta?.category) ?? "Граматика"} · {statusText[entry.status]} · {pct}%
                      </>
                    }
                    action={
                      <Button size="sm" variant="outline" onClick={() => { navigate(`/lesson/${l.id}`); window.scrollTo({ top: 0 }); }}>
                        {ctaText[entry.status]}
                      </Button>
                    }
                    onClick={() => { navigate(`/lesson/${l.id}`); window.scrollTo({ top: 0 }); }}
                    onRemove={() => removeSavedItem("lesson", l.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TOPICS */}
      {tab === "topics" && (
        <div className="mt-4">
          {saved.topics.length === 0 ? (
            <EmptyState
              text="Тут поки немає збережених тем"
              hint="Додай теми, до яких хочеш повернутися пізніше."
              ctaLabel="Переглянути теми"
              to="/courses"
            />
          ) : topics.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Немає збережених тем цього рівня.</div>
          ) : (
            <div className="space-y-2">
              {topics.map((t) => {
                const isVocab = str(t.meta?.kind) === "vocab";
                const topicId = str(t.meta?.topicId) ?? t.id.split(":").slice(1).join(":");
                const to = isVocab ? `/vocab?topic=${topicId}&tab=flash` : `/courses`;
                const count = typeof t.meta?.count === "number" ? t.meta.count : undefined;
                return (
                  <Row
                    key={t.id}
                    icon={<span className="text-base">{str(t.meta?.emoji) ?? "📘"}</span>}
                    title={str(t.meta?.title) ?? topicId}
                    right={str(t.meta?.level) ? <Badge variant="outline" className="shrink-0 text-[10px]">{str(t.meta?.level)}</Badge> : undefined}
                    subtitle={
                      <>
                        {isVocab ? "Wortschatz" : "Граматика"}
                        {str(t.meta?.subtitle) ? ` · ${str(t.meta?.subtitle)}` : ""}
                        {count !== undefined ? ` · ${count}` : ""}
                      </>
                    }
                    action={
                      <Button size="sm" variant="outline" onClick={() => { navigate(to); window.scrollTo({ top: 0 }); }}>
                        {isVocab ? <><Play className="h-3.5 w-3.5 mr-1" /> Повторити</> : <>Відкрити <ArrowRight className="h-3.5 w-3.5 ml-1" /></>}
                      </Button>
                    }
                    onClick={() => { navigate(to); window.scrollTo({ top: 0 }); }}
                    onRemove={() => removeSavedItem("topic", t.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default SavedLibrary;
