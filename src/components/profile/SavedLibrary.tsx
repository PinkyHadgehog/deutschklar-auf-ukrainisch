import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Heart, Bookmark, BookOpen, Layers, RotateCw, Play, ArrowRight } from "lucide-react";
import { vocabThemes, type Level } from "@/data/mock";
import { removeSavedItem, useSavedItems, type SavedItem } from "@/lib/savedItems";
import { getLessonProgressEntry, statusToProgress, type LessonStatus } from "@/lib/lessonProgress";
import { useProgressVersion } from "@/lib/progressAggregate";

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

const SavedLibrary = () => {
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

  const tabs = [
    { id: "words" as const, label: "Слова", count: saved.words.length },
    { id: "lessons" as const, label: "Уроки", count: saved.lessons.length },
    { id: "topics" as const, label: "Теми", count: saved.topics.length },
  ];

  return (
    <Card className="p-6 rounded-2xl border-0 shadow-soft md:col-span-3">
      <div className="font-display font-bold flex items-center gap-2">
        <Bookmark className="h-4 w-4 text-primary" /> Збережене
      </div>
      <p className="text-sm text-muted-foreground mt-1">
        Слова, уроки та теми, які ти хочеш повторити пізніше.
      </p>

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
              {saved.words.length >= 2 && (
                <Button className="mb-3 bg-gradient-primary" onClick={() => navigate("/vocab?tab=flash&saved=1")}>
                  <RotateCw className="h-4 w-4 mr-1.5" /> Повторити всі слова
                </Button>
              )}
              <div className="space-y-2">
                {saved.words.map((w) => {
                  const de = str(w.meta?.de) ?? w.id.split(":").slice(1).join(":");
                  const artikel = str(w.meta?.artikel);
                  const theme = str(w.meta?.theme);
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
                      subtitle={
                        <>
                          {str(w.meta?.uk)} · {themeTitle(theme)}
                          {plural && plural !== "—" ? ` · Pl.: ${plural}` : ""}
                        </>
                      }
                      action={
                        <Button size="sm" variant="outline" onClick={() => navigate(`/vocab?tab=flash&topic=${theme ?? ""}`)}>
                          Повторити
                        </Button>
                      }
                      onRemove={() => removeSavedItem("word", w.id)}
                    />
                  );
                })}
              </div>
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
