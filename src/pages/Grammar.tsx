import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { grammarCategories } from "@/data/mock";
import { getAggregate, getTopicLessonIds, useProgressVersion } from "@/lib/progressAggregate";
import { Lock, Search, ChevronRight } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const Grammar = () => {
  const { t } = useLang();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<string>("all");
  useProgressVersion();

  const filtered = grammarCategories.map((cat) => ({
    ...cat,
    topics: cat.topics.filter((t) =>
      (level === "all" || t.level === level) &&
      (query === "" || t.title.toLowerCase().includes(query.toLowerCase()) || t.titleDe.toLowerCase().includes(query.toLowerCase()))
    ),
  })).filter((cat) => cat.topics.length > 0);

  return (
    <div className="container py-10 md:py-14">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold">{t("grammar.heading")}</h1>
        <p className="text-muted-foreground mt-2">{t("grammar.subtitle")}</p>
      </div>

      <div className="mt-7 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("grammar.searchPlaceholder")} className="pl-9 h-11" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["all", "A1", "A2", "B1", "B2", "C1", "C2"].map((l) => (
            <button key={l} onClick={() => setLevel(l)}
              className={`px-3 h-9 rounded-full text-xs font-semibold border transition ${
                level === l ? "bg-gradient-primary text-primary-foreground border-transparent" : "bg-background hover:bg-muted border-input"
              }`}>{l === "all" ? t("grammar.all") : l}</button>
          ))}
        </div>
      </div>

      <div className="mt-10 space-y-10">
        {filtered.map((cat) => (
          <section key={cat.id}>
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="font-display text-2xl font-extrabold">{cat.title}</h2>
                <p className="text-sm text-muted-foreground">{cat.titleDe}</p>
              </div>
              <Badge variant="outline">{t("grammar.topicsCount", { n: cat.topics.length })}</Badge>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.topics.map((topic) => {
                const stats = getAggregate(getTopicLessonIds(topic.slug));
                return (
                <Card key={topic.slug} className="p-5 rounded-2xl border-0 shadow-soft hover:-translate-y-0.5 transition">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className="bg-primary-soft text-primary border-0">{topic.level}</Badge>
                    {topic.premium && <Badge className="bg-accent text-accent-foreground gap-1"><Lock className="h-3 w-3"/> {t("grammar.premium")}</Badge>}
                  </div>
                  <h3 className="font-display font-bold text-lg">{topic.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{topic.titleDe}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("grammar.lessonsCount", { n: stats.total })}</span>
                    <span className="font-semibold text-primary">{stats.progress}%</span>
                  </div>
                  <Progress value={stats.progress} className="h-1.5 mt-2" />
                  <div className="mt-1 text-xs text-muted-foreground">{t("grammar.lessonsCompletedOf", { completed: stats.completed, total: stats.total })}</div>

                  {topic.sub && (
                    <details className="mt-4 group">
                      <summary className="cursor-pointer text-sm font-semibold text-primary inline-flex items-center gap-1 list-none">
                        {t("grammar.subcategories", { n: topic.sub.length })} <ChevronRight className="h-3.5 w-3.5 transition group-open:rotate-90" />
                      </summary>
                      <ul className="mt-2 space-y-1">
                        {topic.sub.map((s) => (
                          <li key={s.slug}>
                            <Link to={`/lesson/${s.slug}`} className="block py-1.5 px-2 -mx-2 rounded-md hover:bg-muted text-sm">
                              <span className="font-medium">{s.titleDe}</span>
                              <span className="text-muted-foreground"> — {s.title.replace(/^.+? — /, "")}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}

                  {!topic.sub && (
                    <Link to={`/lesson/${topic.slug}`} className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                      {t("grammar.open")} <ChevronRight className="h-4 w-4" />
                    </Link>
                  )}
                </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Grammar;
