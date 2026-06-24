import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Lightbulb, AlertTriangle, Check, X, Sparkles, BookOpen } from "lucide-react";
import { toast } from "sonner";

const Lesson = () => {
  const { slug } = useParams();
  const [progress, setProgress] = useState(35);
  const [mc, setMc] = useState<number | null>(null);
  const [gap, setGap] = useState("");
  const [order, setOrder] = useState<string[]>(["liest", "der", "Mann", "große", "Zeitung", "die", "interessante"]);
  const [ending, setEnding] = useState<string | null>(null);

  const correctMc = 1;
  const correctGap = "interessante";
  const correctOrder = ["Der", "große", "Mann", "liest", "die", "interessante", "Zeitung"]; // visual reference
  const correctEnding = "-e";

  const checkAll = () => {
    let score = 0;
    if (mc === correctMc) score++;
    if (gap.trim().toLowerCase() === correctGap) score++;
    if (ending === correctEnding) score++;
    setProgress(60 + score * 13);
    if (score === 3) toast.success("Чудово! Усі вправи правильні 🎉");
    else toast(`${score}/3 правильно — спробуй ще раз!`);
  };

  return (
    <div className="container max-w-4xl py-8 md:py-12">
      <Link to="/grammar" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> До граматики
      </Link>

      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <Badge variant="secondary" className="bg-primary-soft text-primary border-0">B1</Badge>
        <Badge variant="outline">Прикметники</Badge>
        <Badge variant="outline">Граматика</Badge>
      </div>

      <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-3">
        Adjektivdeklination nach dem bestimmten Artikel
      </h1>
      <p className="text-muted-foreground mt-1">Відмінювання прикметників після означеного артикля ({slug})</p>

      <Progress value={progress} className="h-2 mt-5" />
      <div className="text-xs text-muted-foreground mt-1.5">Прогрес лекції: {progress}%</div>

      {/* GOAL */}
      <Card className="mt-8 p-6 rounded-2xl border-0 shadow-soft bg-info-soft">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-info text-info-foreground grid place-items-center shrink-0"><Sparkles className="h-5 w-5"/></div>
          <div>
            <div className="font-display font-bold">Lernziel · Мета уроку</div>
            <p className="text-sm mt-1 text-foreground/80">Навчитися правильно ставити закінчення прикметників після означеного артикля у всіх чотирьох відмінках.</p>
          </div>
        </div>
      </Card>

      {/* EXPLANATION */}
      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold mb-3">Пояснення</h2>
        <p className="text-foreground/85 leading-relaxed">
          Коли перед прикметником стоїть <b>означений артикль</b> (der, die, das, die), артикль уже «бере на себе» всю інформацію про рід, число та відмінок.
          Тому прикметник отримує лише два варіанти закінчень: <span className="text-primary font-semibold">-e</span> або <span className="text-primary font-semibold">-en</span>.
        </p>

        <div className="mt-5 overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full text-sm min-w-[520px]">
            <thead className="bg-secondary/60">
              <tr>
                <th className="text-left p-3">Kasus</th>
                <th className="text-left p-3">Maskulin</th>
                <th className="text-left p-3">Feminin</th>
                <th className="text-left p-3">Neutrum</th>
                <th className="text-left p-3">Plural</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                ["Nominativ", "der gut-e", "die gut-e", "das gut-e", "die gut-en"],
                ["Akkusativ", "den gut-en", "die gut-e", "das gut-e", "die gut-en"],
                ["Dativ", "dem gut-en", "der gut-en", "dem gut-en", "den gut-en"],
                ["Genitiv", "des gut-en", "der gut-en", "des gut-en", "der gut-en"],
              ].map((row, i) => (
                <tr key={i}>
                  <td className="p-3 font-semibold">{row[0]}</td>
                  {row.slice(1).map((c, j) => (
                    <td key={j} className="p-3">
                      {c.split("-").map((part, k) => k === 0 ? part : <span key={k}><span className="text-primary font-semibold">-{part}</span></span>)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* EXAMPLES */}
      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold mb-3">Приклади</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { de: <>Der <span className="text-primary font-semibold">große</span> Mann liest die <span className="text-primary font-semibold">interessante</span> Zeitung.</>, uk: "Високий чоловік читає цікаву газету.", k: "Nom. + Akk." },
            { de: <>Ich helfe dem <span className="text-primary font-semibold">netten</span> Nachbarn.</>, uk: "Я допомагаю люб'язному сусідові.", k: "Dativ" },
            { de: <>Das Auto des <span className="text-primary font-semibold">jungen</span> Mannes ist neu.</>, uk: "Машина молодого чоловіка нова.", k: "Genitiv" },
            { de: <>Die <span className="text-primary font-semibold">kleinen</span> Kinder spielen im Park.</>, uk: "Маленькі діти граються в парку.", k: "Plural" },
          ].map((ex, i) => (
            <Card key={i} className="p-4 rounded-xl border-0 shadow-soft">
              <Badge variant="outline" className="text-xs mb-2">{ex.k}</Badge>
              <div className="text-base">{ex.de}</div>
              <div className="text-sm text-muted-foreground mt-1">{ex.uk}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* TIP */}
      <Card className="mt-6 p-5 rounded-2xl border-0 bg-accent-soft">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-6 w-6 text-accent-foreground shrink-0 mt-0.5" />
          <div>
            <div className="font-display font-bold">Запам'ятай</div>
            <p className="text-sm mt-1">
              Після <b>der/die/das</b> у <b>Nominativ однини</b> та у <b>Akkusativ однини</b> жіночого й середнього роду — закінчення <span className="text-primary font-bold">-e</span>.
              В усіх інших випадках (включно з усім множинним числом) — <span className="text-primary font-bold">-en</span>.
            </p>
          </div>
        </div>
      </Card>

      {/* COMMON MISTAKES */}
      <Card className="mt-4 p-5 rounded-2xl border-0 bg-destructive/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
          <div>
            <div className="font-display font-bold">Типові помилки українських учнів</div>
            <ul className="text-sm mt-2 space-y-1.5 text-foreground/85">
              <li>❌ <span className="line-through">Ich sehe den groß Mann.</span> → ✅ <span className="font-medium">den <span className="text-primary">großen</span> Mann</span></li>
              <li>❌ <span className="line-through">die klein Kinder</span> → ✅ <span className="font-medium">die <span className="text-primary">kleinen</span> Kinder</span></li>
              <li>❌ <span className="line-through">mit dem nett Freund</span> → ✅ <span className="font-medium">mit dem <span className="text-primary">netten</span> Freund</span></li>
            </ul>
          </div>
        </div>
      </Card>

      {/* EXERCISES */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary"/> Вправи</h2>

        {/* Multiple choice */}
        <Card className="p-5 rounded-2xl border-0 shadow-soft mb-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">1 · Multiple Choice</div>
          <div className="font-medium mb-3">Ich kenne den ___ Lehrer.</div>
          <div className="grid sm:grid-cols-2 gap-2">
            {["nette", "netten", "nett", "nettem"].map((opt, i) => {
              const state = mc === null ? "" : i === correctMc ? "correct" : mc === i ? "wrong" : "";
              return (
                <button key={opt} onClick={() => setMc(i)}
                  className={`text-left p-3 rounded-xl border-2 transition font-medium ${
                    state === "correct" ? "border-success bg-success/10 text-success" :
                    state === "wrong" ? "border-destructive bg-destructive/10 text-destructive" :
                    mc === i ? "border-primary bg-primary-soft" : "border-border hover:border-primary/50"
                  }`}>
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {state === "correct" && <Check className="h-4 w-4" />}
                    {state === "wrong" && <X className="h-4 w-4" />}
                  </div>
                </button>
              );
            })}
          </div>
          {mc !== null && (
            <div className="mt-3 text-sm text-muted-foreground">
              {mc === correctMc ? "✅ Правильно! Akkusativ маск. → -en." : "💡 Akkusativ чоловічого роду: den + прикметник з -en."}
            </div>
          )}
        </Card>

        {/* Gap */}
        <Card className="p-5 rounded-2xl border-0 shadow-soft mb-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">2 · Lückentext</div>
          <div className="font-medium mb-3">Doповніть закінчення: «Sie liest die ___ Zeitung.» (interessant)</div>
          <div className="flex gap-2">
            <input value={gap} onChange={(e) => setGap(e.target.value)} placeholder="interessant…"
              className="flex-1 h-11 rounded-xl border-2 border-input bg-background px-4 font-medium focus:outline-none focus:border-primary" />
          </div>
        </Card>

        {/* Order */}
        <Card className="p-5 rounded-2xl border-0 shadow-soft mb-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">3 · Поставте слова у правильному порядку</div>
          <div className="font-medium mb-3">Скласти речення: «Високий чоловік читає цікаву газету.»</div>
          <div className="flex flex-wrap gap-2">
            {order.map((w, i) => (
              <button key={i}
                onClick={() => {
                  const next = [...order];
                  if (i > 0) { [next[i - 1], next[i]] = [next[i], next[i - 1]]; setOrder(next); }
                }}
                className="px-3 h-10 rounded-xl bg-primary-soft text-primary font-semibold hover:bg-primary/15">
                {w}
              </button>
            ))}
          </div>
          <div className="mt-3 text-xs text-muted-foreground">Підказка: натисни на слово, щоб посунути його ліворуч. Очікувано: «{correctOrder.join(" ")}.»</div>
        </Card>

        {/* Ending */}
        <Card className="p-5 rounded-2xl border-0 shadow-soft mb-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">4 · Оберіть правильне закінчення</div>
          <div className="font-medium mb-3">Die klein___ Kinder spielen im Park.</div>
          <div className="flex gap-2">
            {["-e", "-en", "-er", "-es"].map((e) => (
              <button key={e} onClick={() => setEnding(e)}
                className={`h-11 px-5 rounded-xl border-2 font-bold transition ${
                  ending === e ? (e === correctEnding ? "border-success bg-success/10 text-success" : "border-destructive bg-destructive/10 text-destructive")
                  : "border-border hover:border-primary/50"
                }`}>{e}</button>
            ))}
          </div>
          {ending && ending !== correctEnding && (
            <div className="mt-2 text-sm text-muted-foreground">💡 Зачекай — множина після <b>die</b> = <b>-en</b>… а от у Nominativ однини після <b>die</b> жіночого роду — <b>-e</b>. Тут множина → -en. Перевір!</div>
          )}
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mt-6">
          <Button variant="outline" onClick={checkAll} className="gap-2">Перевірити всі</Button>
          <div className="flex gap-2">
            <Button variant="outline" asChild><Link to="/grammar"><ArrowLeft className="h-4 w-4 mr-1"/> Попередня</Link></Button>
            <Button className="bg-gradient-primary" onClick={() => { setProgress(100); toast.success("Лекцію завершено! +10 балів"); }}>Завершити урок</Button>
            <Button variant="outline" asChild><Link to="/lesson/komparativ-superlativ">Наступна <ArrowRight className="h-4 w-4 ml-1"/></Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson;
