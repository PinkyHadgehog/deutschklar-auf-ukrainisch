import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCw } from "lucide-react";
import type { LearningJourney } from "@/lib/learningJourney";
import { getLessonXp } from "@/lib/learningJourney";

const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric" }) : "";

const Step = ({
  icon,
  tone,
  title,
  meta,
  level,
  href,
  muted,
  last,
}: {
  icon: string;
  tone: "success" | "primary" | "muted";
  title: string;
  meta: string;
  level?: string;
  href?: string;
  muted?: boolean;
  last?: boolean;
}) => {
  const body = (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span
          className={`h-6 w-6 rounded-full grid place-items-center text-xs font-bold shrink-0 ${
            tone === "success"
              ? "bg-success/10 text-success"
              : tone === "primary"
                ? "bg-primary-soft text-primary"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {icon}
        </span>
        {!last && <span className="flex-1 w-px bg-border my-1" />}
      </div>
      <div className={`min-w-0 flex-1 ${last ? "" : "pb-4"}`}>
        <div className="flex items-start gap-2">
          <span className={`text-sm font-semibold truncate ${muted ? "text-muted-foreground" : ""}`}>{title}</span>
          {level && (
            <Badge variant="outline" className="text-[10px] shrink-0 ml-auto">
              {level}
            </Badge>
          )}
        </div>
        <div
          className={`text-xs mt-0.5 ${
            tone === "success" ? "text-success" : tone === "primary" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {meta}
        </div>
      </div>
    </div>
  );

  return href ? (
    <Link to={href} className="block rounded-lg -mx-2 px-2 py-1 hover:bg-secondary/60 transition">
      {body}
    </Link>
  ) : (
    <div className="-mx-2 px-2 py-1">{body}</div>
  );
};

const scrollTop = () => window.scrollTo({ top: 0 });

const LearningJourneyCard = ({
  journey,
  onSwitchLevel,
}: {
  journey: LearningJourney;
  onSwitchLevel?: () => void;
}) => {
  const { state, lastCompletedLesson: completed, currentStartedLesson: current, nextLesson: next, level, nextLevel } =
    journey;

  const primary =
    state === "in_progress" && current
      ? { label: "Продовжити урок", href: `/lesson/${current.slug}` }
      : next
        ? {
            label:
              state === "level_completed"
                ? `Перейти до ${nextLevel}`
                : state === "new_learner"
                  ? "Почати навчання"
                  : "Почати наступний урок",
            href: `/lesson/${next.slug}`,
          }
        : null;

  return (
    <Card className="p-6 rounded-2xl border-0 shadow-soft lg:col-span-2">
      <div className="mb-4">
        <div className="font-display font-bold text-lg">Твій навчальний шлях</div>
        <p className="text-sm text-muted-foreground">Де ти зупинилася і що варто вчити далі</p>
      </div>

      {state === "level_completed" ? (
        <div className="rounded-xl bg-secondary/50 p-4">
          <div className="text-base font-display font-bold">🎉 Рівень {level} завершено</div>
          <p className="text-sm text-muted-foreground mt-1">
            Ти завершила всі уроки цього рівня.
            {next && nextLevel ? " Наступний крок:" : ""}
          </p>
          {next && nextLevel && (
            <div className="mt-3">
              <Step icon="→" tone="primary" title={next.title} level={next.level} href={`/lesson/${next.slug}`} meta={`${nextLevel} · наступний урок`} last />
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl bg-secondary/50 p-4">
          {state === "new_learner" && (
            <p className="text-sm text-muted-foreground mb-3">Ти ще не почала навчання</p>
          )}

          {state !== "new_learner" && completed && (
            <Step
              icon="✓"
              tone="success"
              title={completed.title}
              level={completed.level}
              href={`/lesson/${completed.slug}`}
              last={!current && !next}
              meta={`Завершено ${fmtDate(completed.progress.completedAt)}${
                getLessonXp(completed.slug) > 0 ? ` · +${getLessonXp(completed.slug)} XP` : ""
              }`}
            />
          )}

          {state === "in_progress" && current && (
            <Step
              icon="●"
              tone="primary"
              title={current.title}
              level={current.level}
              href={`/lesson/${current.slug}`}
              meta={`У процесі · ${current.progress.progress}%`}
              last={!next}
            />
          )}

          {next && (
            <Step
              icon={state === "new_learner" ? "○" : state === "in_progress" ? "○" : "→"}
              tone={state === "ready_for_next" ? "primary" : "muted"}
              title={next.title}
              level={next.level}
              href={`/lesson/${next.slug}`}
              meta={state === "new_learner" ? "Перший урок" : "Наступний урок"}
              muted={state === "in_progress"}
              last
            />
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4">
        {primary && (
          <Button asChild size="sm" className="bg-gradient-primary">
            <Link to={primary.href} onClick={scrollTop}>
              {primary.label}
            </Link>
          </Button>
        )}
        {state === "level_completed" && nextLevel && onSwitchLevel && (
          <button
            type="button"
            onClick={onSwitchLevel}
            className="text-xs text-muted-foreground hover:text-primary hover:underline"
          >
            Змінити поточний рівень на {nextLevel}
          </button>
        )}
        {state !== "new_learner" && completed && (
          <Link
            to={`/lesson/${completed.slug}`}
            onClick={scrollTop}
            className="text-xs text-muted-foreground hover:text-primary hover:underline inline-flex items-center gap-1"
          >
            <RotateCw className="h-3 w-3" /> Повторити останній урок
          </Link>
        )}
      </div>
    </Card>
  );
};

export default LearningJourneyCard;
