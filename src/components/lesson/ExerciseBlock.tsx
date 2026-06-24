import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, GripHorizontal } from "lucide-react";
import type { ExerciseItem } from "@/content/exerciseSets";

const norm = (s: string) =>
  s.toLowerCase().replace(/[.,!?;:„"""'’()\s]+/g, " ").trim();

const ExerciseCard = ({ item, idx }: { item: ExerciseItem; idx: number }) => {
  const [answer, setAnswer] = useState<unknown>(null);
  const [checked, setChecked] = useState(false);

  // For "order" — local list of words being arranged
  const [orderWords, setOrderWords] = useState<string[]>(item.type === "order" ? item.words : []);

  const moveLeft = (i: number) => {
    if (i === 0) return;
    const next = [...orderWords];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    setOrderWords(next);
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
    }
  }

  const typeLabel: Record<ExerciseItem["type"], string> = {
    mc: "Multiple Choice",
    gap: "Lückentext",
    tf: "Richtig / Falsch",
    order: "Скласти речення",
    translate: "Переклад",
  };

  return (
    <Card className="p-5 rounded-2xl border-0 shadow-soft mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          {idx + 1} · {typeLabel[item.type]}
        </div>
        {checked && (
          <span className={`text-xs font-semibold inline-flex items-center gap-1 ${correct ? "text-success" : "text-destructive"}`}>
            {correct ? <><Check className="h-3.5 w-3.5"/> Правильно</> : <><X className="h-3.5 w-3.5"/> Неправильно</>}
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
                  disabled={checked}
                  onClick={() => setAnswer(i)}
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
            disabled={checked}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Твоя відповідь…"
            className={`w-full h-11 rounded-xl border-2 px-4 font-medium focus:outline-none ${
              checked ? (correct ? "border-success bg-success/10" : "border-destructive bg-destructive/10") : "border-input focus:border-primary"
            }`}
          />
          {item.hint && !checked && <div className="mt-2 text-xs text-muted-foreground">💡 {item.hint}</div>}
          {checked && !correct && (
            <div className="mt-2 text-xs text-muted-foreground">
              ✅ Правильна відповідь: <b>{Array.isArray(item.answer) ? item.answer[0] : item.answer}</b>
            </div>
          )}
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
                  disabled={checked}
                  onClick={() => setAnswer(v)}
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
                disabled={checked}
                onClick={() => moveLeft(i)}
                className="px-3 h-10 rounded-xl bg-primary-soft text-primary font-semibold hover:bg-primary/15 inline-flex items-center gap-1.5"
              >
                <GripHorizontal className="h-3.5 w-3.5 opacity-60" /> {w}
              </button>
            ))}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Натисни на слово, щоб посунути його ліворуч.</div>
          {checked && !correct && (
            <div className="mt-2 text-xs text-muted-foreground">✅ Правильно: <b>{item.correct.join(" ").replace(/\s([.,!?;:])/g, "$1")}</b></div>
          )}
        </>
      )}

      {/* TRANSLATE */}
      {item.type === "translate" && (
        <>
          <div className="font-medium mb-1">{item.prompt}</div>
          <div className="text-sm text-muted-foreground mb-3">«{item.uk}»</div>
          <textarea
            value={String(answer ?? "")}
            disabled={checked}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Напиши німецькою…"
            rows={2}
            className={`w-full rounded-xl border-2 px-4 py-2 font-medium focus:outline-none ${
              checked ? (correct ? "border-success bg-success/10" : "border-destructive bg-destructive/10") : "border-input focus:border-primary"
            }`}
          />
          {checked && !correct && (
            <div className="mt-2 text-xs text-muted-foreground">
              ✅ Один із прийнятних варіантів: <b>{(Array.isArray(item.de) ? item.de[0] : item.de)}</b>
            </div>
          )}
        </>
      )}

      <div className="mt-4 flex justify-end gap-2">
        {checked ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setChecked(false);
              setAnswer(null);
              if (item.type === "order") setOrderWords(item.words);
            }}
          >Ще раз</Button>
        ) : (
          <Button
            size="sm"
            className="bg-gradient-primary"
            disabled={answer === null && item.type !== "order"}
            onClick={() => setChecked(true)}
          >Перевірити</Button>
        )}
      </div>
    </Card>
  );
};

const ExerciseBlock = ({ items }: { items: ExerciseItem[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-bold mb-4">Додаткові вправи · від легких до складніших</h2>
      <div>
        {items.map((it, i) => (
          <ExerciseCard key={i} item={it} idx={i} />
        ))}
      </div>
    </section>
  );
};

export default ExerciseBlock;
