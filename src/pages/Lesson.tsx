import { useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Lightbulb, AlertTriangle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { getLesson } from "@/content/lessons";
import { exerciseSets, type ExerciseItem } from "@/content/exerciseSets";
import ExerciseBlock from "@/components/lesson/ExerciseBlock";


// Render explanation paragraphs with allowed inline tags (<b>, <span class="hl">, <i>).
const Html = ({ html }: { html: string }) => (
  <span dangerouslySetInnerHTML={{ __html: html.replace(/class='hl'/g, 'class="text-primary font-semibold"') }} />
);

const Lesson = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, completeLesson, isLessonCompleted } = useAuth();

  const lesson = getLesson(slug);

  const alreadyDone = useMemo(() => (slug ? isLessonCompleted(slug) : false), [slug, isLessonCompleted]);
  const [progress, setProgress] = useState(alreadyDone ? 100 : 50);

  if (!lesson) {
    return (
      <div className="container max-w-3xl py-16 text-center">
        <Link to="/grammar" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" /> До граматики
        </Link>
        <h1 className="font-display text-3xl font-extrabold mt-6">Урок у розробці</h1>
        <p className="text-muted-foreground mt-2">
          Контент для цієї теми ({slug}) скоро з'явиться. Оберіть, будь ласка, іншу тему в граматичній бібліотеці.
        </p>
        <Button asChild className="mt-6 bg-gradient-primary"><Link to="/grammar">До бібліотеки</Link></Button>
      </div>
    );
  }

  // Convert legacy single-exercise format (mc/gap/ending) to ExerciseItem[]
  // and prepend to the extra set so everything lives in one unified "Вправи" block.
  const legacyItems: ExerciseItem[] = [];
  const lex = lesson.exercises;
  if (lex.mc) legacyItems.push({ type: "mc", q: lex.mc.q, options: lex.mc.options, correct: lex.mc.correct, explain: lex.mc.explain });
  if (lex.gap) legacyItems.push({ type: "gap", q: lex.gap.q, answer: lex.gap.answer, hint: lex.gap.hint });
  if (lex.ending) {
    legacyItems.push({
      type: "mc",
      q: lex.ending.q,
      options: lex.ending.options,
      correct: Math.max(0, lex.ending.options.indexOf(lex.ending.correct)),
      explain: lex.ending.hint,
    });
  }
  const allExercises: ExerciseItem[] = [...legacyItems, ...(exerciseSets[lesson.slug] ?? [])];

  const finish = () => {
    setProgress(100);
    if (!user) { toast("Увійдіть, щоб зберегти прогрес"); navigate("/login"); return; }
    if (alreadyDone) { toast.success("Лекцію вже зараховано раніше ✓"); return; }
    completeLesson({ slug: lesson.slug, title: lesson.titleDe, level: lesson.level, points: 10 });
    toast.success("Лекцію завершено! +10 балів — прогрес збережено в профілі 🎉");
  };


  return (
    <div className="container max-w-4xl py-8 md:py-12">
      <Link to="/grammar" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> До граматики
      </Link>

      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <Badge variant="secondary" className="bg-primary-soft text-primary border-0">{lesson.level}</Badge>
        <Badge variant="outline">{lesson.category}</Badge>
        <Badge variant="outline">Граматика</Badge>
      </div>

      <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-3">{lesson.titleDe}</h1>
      <p className="text-muted-foreground mt-1">{lesson.titleUk}</p>

      <Progress value={progress} className="h-2 mt-5" />
      <div className="text-xs text-muted-foreground mt-1.5">Прогрес лекції: {progress}%</div>

      {/* GOAL */}
      <Card className="mt-8 p-6 rounded-2xl border-0 shadow-soft bg-info-soft">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-info text-info-foreground grid place-items-center shrink-0"><Sparkles className="h-5 w-5"/></div>
          <div>
            <div className="font-display font-bold">Lernziel · Мета уроку</div>
            <p className="text-sm mt-1 text-foreground/80">{lesson.goal}</p>
          </div>
        </div>
      </Card>

      {/* EXPLANATION */}
      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold mb-3">Пояснення</h2>
        <div className="space-y-3 text-foreground/85 leading-relaxed">
          {lesson.explanation.map((p, i) => (
            <p key={i}><Html html={p} /></p>
          ))}
        </div>

        {lesson.table && (
          <div className="mt-5 overflow-x-auto rounded-2xl border bg-card">
            <table className="w-full text-sm min-w-[520px]">
              <thead className="bg-secondary/60">
                <tr>
                  {lesson.table.headers.map((h, i) => (
                    <th key={i} className="text-left p-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {lesson.table.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((c, j) => (
                      <td key={j} className={`p-3 ${j === 0 ? "font-semibold" : ""}`}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* EXAMPLES */}
      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold mb-3">Приклади</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {lesson.examples.map((ex, i) => (
            <Card key={i} className="p-4 rounded-xl border-0 shadow-soft">
              {ex.tag && <Badge variant="outline" className="text-xs mb-2">{ex.tag}</Badge>}
              <div className="text-base font-medium">{ex.de}</div>
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
            <p className="text-sm mt-1"><Html html={lesson.tip} /></p>
          </div>
        </div>
      </Card>

      {/* MISTAKES */}
      {lesson.mistakes.length > 0 && (
        <Card className="mt-4 p-5 rounded-2xl border-0 bg-destructive/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
            <div>
              <div className="font-display font-bold">Типові помилки</div>
              <ul className="text-sm mt-2 space-y-1.5 text-foreground/85">
                {lesson.mistakes.map((m, i) => (
                  <li key={i}>
                    ❌ <span className="line-through">{m.wrong}</span> → ✅ <span className="font-medium text-primary">{m.right}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* EXERCISES — єдиний блок, від простіших до складніших */}
      <ExerciseBlock items={allExercises} />

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mt-10 pt-6 border-t">
        {lesson.prevSlug ? (
          <Button variant="outline" asChild><Link to={`/lesson/${lesson.prevSlug}`}><ArrowLeft className="h-4 w-4 mr-1"/> Попередня тема</Link></Button>
        ) : (
          <Button variant="outline" asChild><Link to="/grammar"><ArrowLeft className="h-4 w-4 mr-1"/> До бібліотеки</Link></Button>
        )}
        <Button className="bg-gradient-primary" onClick={finish}>
          {alreadyDone ? "Завершено ✓" : "Завершити урок"}
        </Button>
        {lesson.nextSlug ? (
          <Button variant="outline" asChild><Link to={`/lesson/${lesson.nextSlug}`}>Наступна тема <ArrowRight className="h-4 w-4 ml-1"/></Link></Button>
        ) : (
          <Button variant="outline" asChild><Link to="/grammar">До бібліотеки <ArrowRight className="h-4 w-4 ml-1"/></Link></Button>
        )}
      </div>

    </div>
  );
};

export default Lesson;
