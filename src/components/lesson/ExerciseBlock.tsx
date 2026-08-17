import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, GripHorizontal, BookOpen, RotateCcw, Trophy, ArrowRight, Eye, Sparkles } from "lucide-react";
import type { ExerciseItem } from "@/content/exerciseSets";
import {
  addLearningEvent,
  hasAwardedXp,
  lessonExerciseXp,
  submitLessonExerciseResult,
  LESSON_EXERCISE_MAX_XP,
} from "@/lib/xp";


const norm = (s: string) =>
  s.toLowerCase().replace(/[.,!?;:„"""'’()\s]+/g, " ").trim();

const typeLabel: Record<ExerciseItem["type"], string> = {
  mc: "Multiple Choice",
  gap: "Lückentext",
  tf: "Richtig / Falsch",
  order: "Скласти речення",
  translate: "Переклад",
  match: "Зіставлення",
  multi: "Кілька правильних",
  correct: "Виправ помилку",
  writeFree: "Коротка відповідь",
};

interface CardProps {
  item: ExerciseItem;
  idx: number;
  onResult: (correct: boolean) => void;
}

const ExerciseCard = ({ item, idx, onResult }: CardProps) => {
  const [answer, setAnswer] = useState<unknown>(null);
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // ORDER state
  const [orderWords, setOrderWords] = useState<string[]>(item.type === "order" ? item.words : []);
  const moveLeft = (i: number) => {
    if (i === 0) return;
    const next = [...orderWords];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    setOrderWords(next);
  };

  // MATCH state
  const [matchPicks, setMatchPicks] = useState<Record<number, number>>({}); // leftIdx -> rightIdx
  const [activeLeft, setActiveLeft] = useState<number | null>(null);
  const matchRightShuffled = item.type === "match" ? [...item.pairs].reverse().map(p => p.right) : [];
  const matchPick = (rightIdx: number) => {
    if (activeLeft === null || checked) return;
    setMatchPicks({ ...matchPicks, [activeLeft]: rightIdx });
    setActiveLeft(null);
  };

  // MULTI state
  const [multiPicks, setMultiPicks] = useState<Set<number>>(new Set());
  const toggleMulti = (i: number) => {
    if (checked) return;
    const next = new Set(multiPicks);
    if (next.has(i)) next.delete(i); else next.add(i);
    setMultiPicks(next);
  };

  let correct = false;
  if (checked) {
    switch (item.type) {
      case "mc": correct = answer === item.correct; break;
      case "gap": {
        const ans = String(answer ?? "").trim().toLowerCase();
        const expected = Array.isArray(item.answer) ? item.answer.map(a => a.toLowerCase()) : [item.answer.toLowerCase()];
        correct = expected.includes(ans);
        break;
      }
      case "tf": correct = answer === item.correct; break;
      case "order":
        correct = norm(orderWords.join(" ")) === norm(item.correct.join(" "));
        break;
      case "translate": {
        const ans = norm(String(answer ?? ""));
        const expected = Array.isArray(item.de) ? item.de : [item.de];
        correct = expected.some(e => norm(e) === ans);
        break;
      }
      case "match": {
        correct = item.pairs.every((_, leftIdx) => {
          const rightIdx = matchPicks[leftIdx];
          if (rightIdx === undefined) return false;
          return matchRightShuffled[rightIdx] === item.pairs[leftIdx].right;
        });
        break;
      }
      case "multi": {
        const picks = [...multiPicks].sort();
        const want = [...item.correct].sort();
        correct = picks.length === want.length && picks.every((v, i) => v === want[i]);
        break;
      }
      case "correct": {
        const ans = norm(String(answer ?? ""));
        const expected = Array.isArray(item.correct) ? item.correct : [item.correct];
        correct = expected.some(e => norm(e) === ans);
        break;
      }
      case "writeFree":
        correct = String(answer ?? "").trim().length >= 10;
        break;
    }
  }

  const onCheck = () => {
    setChecked(true);
    setAttempts(a => a + 1);
  };

  const onRetry = () => {
    setChecked(false);
    setAnswer(null);
    if (item.type === "order") setOrderWords(item.words);
    if (item.type === "match") { setMatchPicks({}); setActiveLeft(null); }
    if (item.type === "multi") setMultiPicks(new Set());
  };

  // report result to parent — ONLY the first submitted answer counts for the score.
  // A wrong first attempt stays wrong even if the learner retries or reveals the answer.
  const reportedRef = useRef(false);
  useEffect(() => {
    if (!checked || reportedRef.current) return;
    reportedRef.current = true;
    onResult(correct);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);


  const expectedAnswerText = (() => {
    switch (item.type) {
      case "mc": return item.options[item.correct];
      case "gap": return Array.isArray(item.answer) ? item.answer[0] : item.answer;
      case "tf": return item.correct ? "Richtig" : "Falsch";
      case "order": return item.correct.join(" ").replace(/\s([.,!?;:])/g, "$1");
      case "translate": return Array.isArray(item.de) ? item.de[0] : item.de;
      case "match": return item.pairs.map(p => `${p.left} → ${p.right}`).join(" · ");
      case "multi": return item.correct.map(i => item.options[i]).join(" · ");
      case "correct": return Array.isArray(item.correct) ? item.correct[0] : item.correct;
      case "writeFree": return item.sample;
    }
  })();

  const explain = "explain" in item ? item.explain : undefined;
  const canShowAnswer = attempts >= 1 && !correct;

  return (
    <Card className="p-5 rounded-2xl border-0 shadow-soft mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          {idx + 1} · {typeLabel[item.type]}
        </div>
        {checked && (
          <span className={`text-xs font-semibold inline-flex items-center gap-1 ${correct ? "text-success" : "text-destructive"}`}>
            {correct ? <><Check className="h-3.5 w-3.5"/> Правильно!</> : <><X className="h-3.5 w-3.5"/> Спробуй ще раз</>}
          </span>
        )}
      </div>

      {/* MC */}
      {item.type === "mc" && (
        <>
          <div className="font-medium mb-3">{item.q}</div>
          <div className="grid sm:grid-cols-2 gap-2">
            {item.options.map((opt, i) => {
              const isPicked = answer === i;
              const state = !checked ? "" : i === item.correct ? "correct" : isPicked ? "wrong" : "";
              return (
                <button
                  key={i}
                  disabled={checked && correct}
                  onClick={() => { setAnswer(i); setChecked(false); }}
                  className={`text-left p-3 rounded-xl border-2 transition font-medium text-sm ${
                    state === "correct" ? "border-success bg-success/10 text-success"
                    : state === "wrong" ? "border-destructive bg-destructive/10 text-destructive"
                    : isPicked ? "border-primary bg-primary-soft"
                    : "border-border hover:border-primary/50"
                  }`}
                >{opt}</button>
              );
            })}
          </div>
        </>
      )}

      {/* GAP */}
      {item.type === "gap" && (
        <>
          <div className="font-medium mb-3">{item.q}</div>
          <input
            value={String(answer ?? "")}
            disabled={checked && correct}
            onChange={(e) => { setAnswer(e.target.value); setChecked(false); }}
            placeholder="Твоя відповідь…"
            className={`w-full h-11 rounded-xl border-2 px-4 font-medium focus:outline-none ${
              checked ? (correct ? "border-success bg-success/10" : "border-destructive bg-destructive/10") : "border-input focus:border-primary"
            }`}
          />
          {item.hint && !checked && <div className="mt-2 text-xs text-muted-foreground">💡 {item.hint}</div>}
        </>
      )}

      {/* TF */}
      {item.type === "tf" && (
        <>
          <div className="font-medium mb-3">{item.q}</div>
          <div className="flex gap-2">
            {[
              { v: true, l: "Richtig" },
              { v: false, l: "Falsch" },
            ].map(({ v, l }) => {
              const isPicked = answer === v;
              const state = !checked ? "" : v === item.correct ? "correct" : isPicked ? "wrong" : "";
              return (
                <button
                  key={l}
                  disabled={checked && correct}
                  onClick={() => { setAnswer(v); setChecked(false); }}
                  className={`h-11 px-5 rounded-xl border-2 font-semibold transition ${
                    state === "correct" ? "border-success bg-success/10 text-success"
                    : state === "wrong" ? "border-destructive bg-destructive/10 text-destructive"
                    : isPicked ? "border-primary bg-primary-soft"
                    : "border-border hover:border-primary/50"
                  }`}
                >{l}</button>
              );
            })}
          </div>
        </>
      )}

      {/* ORDER */}
      {item.type === "order" && (
        <>
          <div className="font-medium mb-3">{item.prompt}</div>
          <div className="flex flex-wrap gap-2">
            {orderWords.map((w, i) => (
              <button
                key={i}
                disabled={checked && correct}
                onClick={() => moveLeft(i)}
                className="px-3 h-10 rounded-xl bg-primary-soft text-primary font-semibold hover:bg-primary/15 inline-flex items-center gap-1.5"
              >
                <GripHorizontal className="h-3.5 w-3.5 opacity-60" /> {w}
              </button>
            ))}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Натисни на слово, щоб посунути його ліворуч.</div>
        </>
      )}

      {/* TRANSLATE */}
      {item.type === "translate" && (
        <>
          <div className="font-medium mb-1">{item.prompt}</div>
          <div className="text-sm text-muted-foreground mb-3">«{item.uk}»</div>
          <textarea
            value={String(answer ?? "")}
            disabled={checked && correct}
            onChange={(e) => { setAnswer(e.target.value); setChecked(false); }}
            placeholder="Напиши німецькою…"
            rows={2}
            className={`w-full rounded-xl border-2 px-4 py-2 font-medium focus:outline-none ${
              checked ? (correct ? "border-success bg-success/10" : "border-destructive bg-destructive/10") : "border-input focus:border-primary"
            }`}
          />
        </>
      )}

      {/* MATCH */}
      {item.type === "match" && (
        <>
          <div className="font-medium mb-3">{item.prompt}</div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              {item.pairs.map((p, leftIdx) => {
                const pickedRight = matchPicks[leftIdx];
                const matchedText = pickedRight !== undefined ? matchRightShuffled[pickedRight] : null;
                const isActive = activeLeft === leftIdx;
                const isRight = checked && matchedText === p.right;
                const isWrong = checked && matchedText !== null && matchedText !== p.right;
                return (
                  <button key={leftIdx}
                    disabled={checked && correct}
                    onClick={() => setActiveLeft(leftIdx)}
                    className={`w-full text-left p-3 rounded-xl border-2 text-sm transition ${
                      isRight ? "border-success bg-success/10"
                      : isWrong ? "border-destructive bg-destructive/10"
                      : isActive ? "border-primary bg-primary-soft"
                      : "border-border hover:border-primary/50"
                    }`}>
                    <div className="font-medium">{p.left}</div>
                    {matchedText && <div className="text-xs text-muted-foreground mt-0.5">→ {matchedText}</div>}
                  </button>
                );
              })}
            </div>
            <div className="space-y-2">
              {matchRightShuffled.map((r, rIdx) => {
                const used = Object.values(matchPicks).includes(rIdx);
                return (
                  <button key={rIdx}
                    disabled={(checked && correct) || activeLeft === null}
                    onClick={() => matchPick(rIdx)}
                    className={`w-full text-left p-3 rounded-xl border-2 text-sm transition ${
                      used ? "opacity-50 border-border" : "border-border hover:border-primary/50"
                    }`}>
                    {r}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Спочатку обери ліворуч, потім — праворуч.</div>
        </>
      )}

      {/* MULTI */}
      {item.type === "multi" && (
        <>
          <div className="font-medium mb-3">{item.q}</div>
          <div className="grid sm:grid-cols-2 gap-2">
            {item.options.map((opt, i) => {
              const picked = multiPicks.has(i);
              const inCorrect = item.correct.includes(i);
              const state = !checked ? "" : inCorrect && picked ? "correct" : inCorrect ? "missed" : picked ? "wrong" : "";
              return (
                <button key={i}
                  disabled={checked && correct}
                  onClick={() => toggleMulti(i)}
                  className={`text-left p-3 rounded-xl border-2 transition font-medium text-sm ${
                    state === "correct" ? "border-success bg-success/10 text-success"
                    : state === "missed" ? "border-success/50 bg-success/5 text-success/80"
                    : state === "wrong" ? "border-destructive bg-destructive/10 text-destructive"
                    : picked ? "border-primary bg-primary-soft"
                    : "border-border hover:border-primary/50"
                  }`}>
                  <span className="inline-block w-4">{picked ? "☑" : "☐"}</span> {opt}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* CORRECT */}
      {item.type === "correct" && (
        <>
          <div className="font-medium mb-1">{item.prompt}</div>
          <div className="text-sm mb-3 text-destructive">❌ <span className="line-through">{item.wrong}</span></div>
          <input
            value={String(answer ?? "")}
            disabled={checked && correct}
            onChange={(e) => { setAnswer(e.target.value); setChecked(false); }}
            placeholder="Запиши правильний варіант…"
            className={`w-full h-11 rounded-xl border-2 px-4 font-medium focus:outline-none ${
              checked ? (correct ? "border-success bg-success/10" : "border-destructive bg-destructive/10") : "border-input focus:border-primary"
            }`}
          />
        </>
      )}

      {/* WRITE FREE */}
      {item.type === "writeFree" && (
        <>
          <div className="font-medium mb-3">{item.prompt}</div>
          <textarea
            value={String(answer ?? "")}
            disabled={checked && correct}
            onChange={(e) => { setAnswer(e.target.value); setChecked(false); }}
            placeholder="Напиши свою відповідь (мін. 10 символів)…"
            rows={3}
            className={`w-full rounded-xl border-2 px-4 py-2 font-medium focus:outline-none ${
              checked ? (correct ? "border-success bg-success/10" : "border-destructive bg-destructive/10") : "border-input focus:border-primary"
            }`}
          />
        </>
      )}

      {/* FEEDBACK + buttons */}
      {checked && !correct && (
        <div className="mt-3 p-3 rounded-xl bg-destructive/5 text-sm">
          <div className="font-semibold text-destructive">Спробуй ще раз.</div>
          {explain && <div className="text-foreground/80 mt-1">💡 {explain}</div>}
          {showAnswer && (
            <div className="mt-2 text-foreground">
              ✅ Правильна відповідь: <b>{expectedAnswerText}</b>
            </div>
          )}
        </div>
      )}
      {checked && correct && explain && (
        <div className="mt-3 p-3 rounded-xl bg-success/5 text-sm text-foreground/85">
          <span className="font-semibold text-success">Правильно!</span> {explain}
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2 flex-wrap">
        {!checked && (
          <Button
            size="sm"
            className="bg-gradient-primary"
            disabled={
              (item.type !== "order" && item.type !== "match" && item.type !== "multi" && (answer === null || answer === "")) ||
              (item.type === "match" && Object.keys(matchPicks).length < item.pairs.length) ||
              (item.type === "multi" && multiPicks.size === 0)
            }
            onClick={onCheck}
          >Перевірити</Button>
        )}
        {checked && !correct && (
          <>
            {canShowAnswer && !showAnswer && (
              <Button variant="outline" size="sm" onClick={() => setShowAnswer(true)}>
                <Eye className="h-4 w-4 mr-1" /> Показати відповідь
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RotateCcw className="h-4 w-4 mr-1" /> Ще раз
            </Button>
          </>
        )}
        {checked && correct && (
          <Button variant="ghost" size="sm" onClick={onRetry}>
            <RotateCcw className="h-4 w-4 mr-1" /> Повторити
          </Button>
        )}
      </div>
    </Card>
  );
};

interface BlockProps {
  items: ExerciseItem[];
  lessonId?: string;
  onFinish?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const ExerciseBlock = ({ items, lessonId, onFinish, onNext, onPrev }: BlockProps) => {
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [round, setRound] = useState(0);
  // indices (into `items`) of the current run; null = full set
  const [subset, setSubset] = useState<number[] | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const awardedRef = useRef(false);

  const isRepeat = subset !== null;
  const activeIdx = subset ?? items.map((_, i) => i);
  const total = activeIdx.length;
  const answered = Object.keys(results).length;
  const correctCount = Object.values(results).filter(Boolean).length;
  const allDone = total > 0 && answered >= total;
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const wrongIdx = activeIdx.filter((i) => results[i] === false);

  // award XP once, after the full set is completed
  useEffect(() => {
    if (!allDone || isRepeat || awardedRef.current) return;
    awardedRef.current = true;
    const id = lessonId ?? "lesson";
    const already = hasAwardedXp("lesson_exercises", id);
    const xp = already ? 0 : lessonExerciseXp(correctCount, total);
    if (xp > 0) addLearningEvent("lesson_exercises", id, xp);
    setXpEarned(xp);
    submitLessonExerciseResult({
      lesson_id: id,
      correct: correctCount,
      total,
      percentage: percent,
      xp_earned: xp,
    });
  }, [allDone, isRepeat, lessonId, correctCount, total, percent]);

  if (!items || items.length === 0) return null;

  let message = "Чудовий результат! Ти добре засвоїв / засвоїла цю тему.";
  let suggestRepeat = false;
  if (percent < 50) { message = "Раджу повторити теорію — ти зрозумієш матеріал краще на другому колі."; suggestRepeat = true; }
  else if (percent < 80) { message = "Гарний результат! Кілька тем варто повторити."; }

  const restart = (only: number[] | null) => {
    setResults({});
    setSubset(only);
    setXpEarned(0);
    awardedRef.current = only === null; // repeated full set: XP already handled by hasAwardedXp
    if (only === null) awardedRef.current = false;
    setRound((r) => r + 1);
  };

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between mb-1">
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary"/> Вправи
        </h2>
        <span className="text-sm text-muted-foreground">
          {total} завдань · від простіших до складніших
          {!isRepeat && (
            <span className="ml-2 inline-flex items-center gap-1 text-primary font-medium">
              <Sparkles className="h-3.5 w-3.5" /> до {LESSON_EXERCISE_MAX_XP} XP
            </span>
          )}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {isRepeat ? "Режим повторення помилок — без XP. " : "Виконуй по черзі та перевіряй себе одразу. "}
        Прогрес: <b>{answered}/{total}</b> · правильно: <b>{correctCount}</b>.
      </p>
      <div>
        {activeIdx.map((i, pos) => (
          <ExerciseCard
            key={`${round}-${i}`}
            item={items[i]}
            idx={pos}
            onResult={(ok) => setResults(prev => prev[i] === undefined ? { ...prev, [i]: ok } : prev)}
          />
        ))}
      </div>

      {allDone && (
        <Card className="mt-6 p-6 rounded-2xl border-0 shadow-soft bg-gradient-primary text-primary-foreground">
          <div className="flex items-start gap-4">
            <Trophy className="h-10 w-10 shrink-0" />
            <div className="flex-1">
              <div className="font-display text-xl font-extrabold">🎉 Вправи завершено!</div>
              <div className="font-display text-lg font-bold mt-1">
                {correctCount} / {total} правильно · {percent}%
              </div>
              <div className="mt-1 inline-flex items-center gap-1 text-sm font-semibold">
                <Sparkles className="h-4 w-4" /> {isRepeat || xpEarned === 0 ? "0 XP" : `+${xpEarned} XP`}
              </div>
              {!isRepeat && xpEarned === 0 && (
                <div className="text-xs opacity-80 mt-1">XP за ці вправи вже нараховано раніше.</div>
              )}
              <p className="text-sm opacity-90 mt-2">{message}</p>
              {wrongIdx.length > 0 && (
                <div className="text-sm opacity-90 mt-1">
                  {wrongIdx.length} {wrongIdx.length === 1 ? "помилка варта" : "помилки варто"} повторити
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {wrongIdx.length > 0 && (
                  <Button variant="secondary" size="sm" onClick={() => restart(wrongIdx)}>
                    <RotateCcw className="h-4 w-4 mr-1" /> Повторити помилки
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={() => restart(null)}>
                  <RotateCcw className="h-4 w-4 mr-1" /> Повторити вправи
                </Button>
                {onPrev && (
                  <Button variant="secondary" size="sm" onClick={onPrev}>До уроку</Button>
                )}
                {onFinish && (
                  <Button size="sm" className="bg-white text-primary hover:bg-white/90" onClick={onFinish}>
                    Завершити урок
                  </Button>
                )}
                {onNext && !suggestRepeat && (
                  <Button size="sm" className="bg-white text-primary hover:bg-white/90" onClick={onNext}>
                    Наступний урок <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </section>
  );
};


export default ExerciseBlock;
