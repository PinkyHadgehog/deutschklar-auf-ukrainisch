import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { placementQuiz } from "@/data/mock";
import { Check, X, Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLang } from "@/context/LanguageContext";

const PlacementTest = () => {
  const { t } = useLang();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const total = placementQuiz.length;
  const q = placementQuiz[idx];

  const pick = (i: number) => {
    const next = [...answers, i];
    setAnswers(next);
    if (next.length === total) setDone(true);
    else setIdx(idx + 1);
  };

  const score = answers.filter((a, i) => a === placementQuiz[i].correct).length;
  const level = score <= 2 ? "A1" : score <= 4 ? "A2" : score <= 6 ? "B1" : score <= 8 ? "B2" : "C1";
  const strengths = answers.slice(0, 4).filter((a, i) => a === placementQuiz[i].correct).length >= 3 ? t("placement.result.strengthGrammar") : t("placement.result.strengthVocab");
  const weaknesses = answers.slice(-4).filter((a, i) => a !== placementQuiz[i + (total - 4)].correct).length >= 2 ? t("placement.result.weaknessTenses") : t("placement.result.weaknessPrepositions");

  if (done) {
    return (
      <div className="container max-w-2xl py-14">
        <Card className="p-10 rounded-3xl border-0 shadow-elevated text-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-primary grid place-items-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-extrabold">{t("placement.result.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("placement.result.subtitle")}</p>
          <div className="mt-4 font-display text-6xl font-extrabold text-gradient">{level}</div>
          <div className="mt-2 text-sm text-muted-foreground">{t("placement.result.correctAnswers", { score, total })}</div>

          <div className="mt-8 grid sm:grid-cols-2 gap-3 text-left">
            <Card className="p-4 rounded-xl border-0 bg-success/10">
              <div className="text-xs uppercase text-success font-semibold">{t("placement.result.strengths")}</div>
              <div className="font-semibold mt-1">{strengths}</div>
            </Card>
            <Card className="p-4 rounded-xl border-0 bg-accent-soft">
              <div className="text-xs uppercase text-accent-foreground font-semibold">{t("placement.result.weaknesses")}</div>
              <div className="font-semibold mt-1">{weaknesses}</div>
            </Card>
          </div>

          <div className="mt-8 text-left">
            <div className="font-display font-bold mb-2">{t("placement.result.recommendationsTitle")}</div>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between items-center p-3 rounded-lg bg-secondary/60"><span>{t("placement.result.courseAt", { level })}</span><Link to="/courses" className="text-primary text-sm font-semibold">{t("placement.result.goTo")}</Link></li>
              <li className="flex justify-between items-center p-3 rounded-lg bg-secondary/60"><span>{t("placement.result.lessonAdjektiv")}</span><Link to="/lesson/adjektivdeklination-bestimmter" className="text-primary text-sm font-semibold">{t("placement.result.lesson")}</Link></li>
              <li className="flex justify-between items-center p-3 rounded-lg bg-secondary/60"><span>{t("placement.result.vocabBewerbung")}</span><Link to="/vocab" className="text-primary text-sm font-semibold">{t("placement.result.open")}</Link></li>
            </ul>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <Button onClick={() => { setIdx(0); setAnswers([]); setDone(false); }} variant="outline">{t("placement.result.retake")}</Button>
            <Button asChild className="bg-gradient-primary">
              <Link to="/signup">{t("placement.result.createAccount")} <ArrowRight className="h-4 w-4 ml-1"/></Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-14">
      <div className="text-center">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold">{t("placement.test.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("placement.test.meta")}</p>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">{t("placement.test.questionCounter", { current: idx + 1, total })}</span>
          <Badge variant="outline">{Math.round((idx / total) * 100)}%</Badge>
        </div>
        <Progress value={((idx + 1) / total) * 100} className="h-2" />
      </div>

      <Card className="mt-6 p-7 rounded-2xl border-0 shadow-soft">
        <div className="font-display text-xl font-bold mb-5">{q.q}</div>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => pick(i)}
              className="text-left p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary-soft font-medium transition">
              {opt}
            </button>
          ))}
        </div>
        <div className="text-xs text-muted-foreground mt-5">{t("placement.test.randomHint")}</div>
      </Card>
    </div>
  );
};

export default PlacementTest;
