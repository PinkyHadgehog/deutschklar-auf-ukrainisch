import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, X, ArrowRight, RotateCcw, Sparkles, BookOpen } from "lucide-react";
import type { VocabWord } from "@/data/mock";
import {
  buildQuiz,
  fullGerman,
  scoreQuiz,
  submitAnswer,
  saveProgress,
  XP,
  DEFAULT_QUIZ_LENGTH,
  type QuizAnswerRecord,
} from "@/lib/quiz";

interface QuizModeProps {
  words: VocabWord[];
  themeId: string;
  themeTitle: string;
  onBackToVocab: () => void;
}

const QuizMode = ({ words, themeId, themeTitle, onBackToVocab }: QuizModeProps) => {
  const [round, setRound] = useState(0);
  const [pool, setPool] = useState<VocabWord[]>(words);
  const [length, setLength] = useState(DEFAULT_QUIZ_LENGTH);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswerRecord[]>([]);
  const [totalXp, setTotalXp] = useState(0);

  const questions = useMemo(() => buildQuiz(pool, length), [pool, length, round]);

  const restart = (nextPool: VocabWord[], nextLength: number) => {
    setPool(nextPool);
    setLength(nextLength);
    setIdx(0);
    setPicked(null);
    setLocked(false);
    setAnswers([]);
    setRound((r) => r + 1);
  };

  if (questions.length === 0) {
    return (
      <Card className="p-8 rounded-3xl border-0 shadow-soft text-center">
        <div className="text-muted-foreground">
          Недостатньо слів у цій темі, щоб скласти квіз. Обери іншу тему.
        </div>
      </Card>
    );
  }

  const finished = idx >= questions.length;

  if (finished) {
    const score = scoreQuiz(answers);
    const wrong = answers.filter((a) => !a.correct).map((a) => a.word);
    const gained = score.xp;
    if (totalXp === 0 || round >= 0) {
      // XP is accumulated once per finished round
    }
    return (
      <Card className="p-8 rounded-3xl border-0 shadow-elevated">
        <div className="text-center">
          <div className="text-3xl font-display font-extrabold">🎉 Quiz abgeschlossen!</div>
          <div className="mt-4 font-display text-4xl font-extrabold text-primary">
            {score.correct} / {score.total} правильно
          </div>
          <div className="text-muted-foreground mt-1">{score.percent} %</div>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-primary text-primary-foreground font-bold">
            <Sparkles className="h-4 w-4" /> +{gained} XP
          </div>
          <div className="mt-4 text-sm text-muted-foreground space-y-0.5">
            {score.breakdown.map((b) => (
              <div key={b.label}>
                {b.label} · +{b.xp} XP
              </div>
            ))}
          </div>
        </div>

        {wrong.length > 0 && (
          <div className="mt-6">
            <div className="font-display font-bold mb-2">
              {wrong.length} {wrong.length === 1 ? "слово варто повторити" : "слів варто повторити"}
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {wrong.map((w, i) => (
                <div key={`${w.de}-${i}`} className="p-3 rounded-xl bg-secondary/60 text-sm">
                  <span className="font-semibold">{fullGerman(w)}</span>
                  <span className="text-muted-foreground"> — {w.uk}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {wrong.length > 0 && (
            <Button
              className="bg-gradient-primary"
              onClick={() => {
                setTotalXp((x) => x + gained);
                saveProgress({ topicId: themeId, xp: gained, wrongWords: wrong.map((w) => w.de) });
                restart(wrong, Math.min(wrong.length, DEFAULT_QUIZ_LENGTH));
              }}
            >
              <RotateCcw className="h-4 w-4 mr-1" /> Повторити помилки
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => {
              setTotalXp((x) => x + gained);
              saveProgress({ topicId: themeId, xp: gained, wrongWords: wrong.map((w) => w.de) });
              restart(words, DEFAULT_QUIZ_LENGTH);
            }}
          >
            Новий квіз
          </Button>
          <Button variant="ghost" onClick={onBackToVocab}>
            <BookOpen className="h-4 w-4 mr-1" /> До словника
          </Button>
        </div>
      </Card>
    );
  }

  const q = questions[idx];
  const isCorrect = picked !== null && picked === q.correctIndex;

  const choose = (i: number) => {
    if (locked) return;
    setPicked(i);
    setLocked(true);
    const correct = i === q.correctIndex;
    submitAnswer({ questionId: q.id, correct });
    setAnswers((a) => [...a, { questionId: q.id, word: q.word, correct }]);
  };

  const next = () => {
    setPicked(null);
    setLocked(false);
    setIdx((i) => i + 1);
  };

  return (
    <Card className="p-6 md:p-8 rounded-3xl border-0 shadow-elevated">
      <div className="flex items-center justify-between">
        <Badge>Quiz · {themeTitle}</Badge>
        <span className="text-xs text-muted-foreground">
          Питання {idx + 1} з {questions.length}
        </span>
      </div>
      <Progress value={((idx + (locked ? 1 : 0)) / questions.length) * 100} className="mt-3 h-2" />

      <div className="mt-6 font-display text-xl md:text-2xl font-extrabold">{q.prompt}</div>
      {q.sub && <div className="mt-2 text-lg text-muted-foreground">{q.sub}</div>}

      <div className="mt-5 grid sm:grid-cols-2 gap-2">
        {q.options.map((opt, i) => {
          const state = !locked
            ? ""
            : i === q.correctIndex
            ? "correct"
            : i === picked
            ? "wrong"
            : "";
          return (
            <button
              key={`${opt}-${i}`}
              onClick={() => choose(i)}
              disabled={locked}
              className={`text-left p-3 rounded-xl border-2 transition font-medium text-sm ${
                state === "correct"
                  ? "border-success bg-success/10 text-success"
                  : state === "wrong"
                  ? "border-destructive bg-destructive/10 text-destructive"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {locked && (
        <div className="mt-5">
          <div
            className={`flex items-center gap-2 font-semibold ${
              isCorrect ? "text-success" : "text-destructive"
            }`}
          >
            {isCorrect ? (
              <>
                <Check className="h-4 w-4" /> Правильно! +{XP.perCorrect} XP
              </>
            ) : (
              <>
                <X className="h-4 w-4" /> Неправильно
              </>
            )}
          </div>
          {!isCorrect && (
            <div className="mt-1 text-sm text-muted-foreground">
              Правильна відповідь: <span className="font-semibold text-foreground">{q.options[q.correctIndex]}</span>
            </div>
          )}
          <Button className="mt-4 bg-gradient-primary" onClick={next}>
            Далі <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </Card>
  );
};

export default QuizMode;
