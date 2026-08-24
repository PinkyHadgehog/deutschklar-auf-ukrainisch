import { Card } from "@/components/ui/card";
import { Target, BookCheck, Lightbulb, Globe2, ListChecks, Info } from "lucide-react";
import type { LessonExtras } from "@/content/lessonExtensions";
import { useLang } from "@/context/LanguageContext";

const Html = ({ html }: { html: string }) => (
  <span dangerouslySetInnerHTML={{ __html: html.replace(/class='hl'/g, 'class="text-primary font-semibold"') }} />
);

export const LearningGoals = ({ goals }: { goals: string[] }) => {
  const { t } = useLang();
  return (
  <Card className="mt-6 p-5 rounded-2xl border-0 shadow-soft bg-primary-soft">
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground grid place-items-center shrink-0">
        <Target className="h-5 w-5" />
      </div>
      <div>
        <div className="font-display font-bold">{t("lesson.sections.learningGoalsTitle")}</div>
        <ul className="mt-2 space-y-1 text-sm text-foreground/85">
          {goals.map((g, i) => (
            <li key={i} className="flex gap-2"><span className="text-primary">✓</span><span>{g}</span></li>
          ))}
        </ul>
      </div>
    </div>
  </Card>
  );
};

export const RuleBox = ({ rule }: { rule: NonNullable<LessonExtras["ruleBox"]> }) => {
  const { t } = useLang();
  return (
  <Card className="mt-6 p-5 rounded-2xl border-2 border-primary/30 bg-card shadow-soft">
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground grid place-items-center shrink-0">
        <BookCheck className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="font-display font-bold text-primary">{t("lesson.sections.ruleTitle")}{rule.title ? ` · ${rule.title}` : ""}</div>
        <p className="text-sm mt-1.5"><Html html={rule.rule} /></p>
        {rule.examples && rule.examples.length > 0 && (
          <div className="mt-3 grid sm:grid-cols-2 gap-2">
            {rule.examples.map((ex, i) => (
              <div key={i} className="p-3 rounded-xl bg-secondary/40">
                <div className="text-sm font-medium">{ex.de}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{ex.uk}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </Card>
  );
};

export const UkrainianTips = ({ tips }: { tips: string[] }) => {
  const { t } = useLang();
  return (
  <Card className="mt-6 p-5 rounded-2xl border-0 bg-info-soft shadow-soft">
    <div className="flex items-start gap-3">
      <Lightbulb className="h-6 w-6 text-info shrink-0 mt-0.5" />
      <div>
        <div className="font-display font-bold">{t("lesson.sections.tipsTitle")}</div>
        <ul className="mt-2 space-y-1.5 text-sm text-foreground/85">
          {tips.map((t, i) => (
            <li key={i} className="flex gap-2"><span className="text-info">→</span><span><Html html={t} /></span></li>
          ))}
        </ul>
      </div>
    </div>
  </Card>
  );
};

export const LanguageComparison = ({ data }: { data: NonNullable<LessonExtras["languageComparison"]> }) => {
  const { t } = useLang();
  return (
  <Card className="mt-6 p-5 rounded-2xl border-0 bg-secondary/40 shadow-soft">
    <div className="flex items-start gap-3">
      <Globe2 className="h-6 w-6 text-foreground/70 shrink-0 mt-0.5" />
      <div className="flex-1">
        <div className="font-display font-bold">{t("lesson.sections.comparisonTitle")}</div>
        <div className="grid sm:grid-cols-3 gap-3 mt-3">
          {data.commons && data.commons.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider text-success font-bold mb-1">{t("lesson.sections.commonLabel")}</div>
              <ul className="text-sm space-y-1">{data.commons.map((c,i)=><li key={i}>· {c}</li>)}</ul>
            </div>
          )}
          {data.diffs && data.diffs.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider text-primary font-bold mb-1">{t("lesson.sections.diffsLabel")}</div>
              <ul className="text-sm space-y-1">{data.diffs.map((c,i)=><li key={i}>· {c}</li>)}</ul>
            </div>
          )}
          {data.traps && data.traps.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider text-destructive font-bold mb-1">{t("lesson.sections.trapsLabel")}</div>
              <ul className="text-sm space-y-1">{data.traps.map((c,i)=><li key={i}>· {c}</li>)}</ul>
            </div>
          )}
        </div>
      </div>
    </div>
  </Card>
  );
};

export const LessonSummary = ({ items }: { items: string[] }) => {
  const { t } = useLang();
  return (
  <Card className="mt-6 p-5 rounded-2xl border-0 bg-accent-soft shadow-soft">
    <div className="flex items-start gap-3">
      <ListChecks className="h-6 w-6 text-accent-foreground shrink-0 mt-0.5" />
      <div>
        <div className="font-display font-bold">{t("lesson.sections.summaryTitle")}</div>
        <ol className="mt-2 space-y-1.5 text-sm list-decimal list-inside text-foreground/85">
          {items.map((s, i) => <li key={i}><Html html={s} /></li>)}
        </ol>
      </div>
    </div>
  </Card>
  );
};

export const PremiumNotice = () => {
  const { t } = useLang();
  return (
  <Card className="mt-6 p-5 rounded-2xl border-0 bg-amber-500/5 shadow-soft">
    <div className="flex items-start gap-3">
      <Info className="h-5 w-5 text-amber-600 mt-0.5" />
      <p className="text-sm text-foreground/80">
        <span dangerouslySetInnerHTML={{ __html: t("lesson.sections.premiumTitle") }} />{" "}
        {t("lesson.sections.premiumDesc")}
      </p>
    </div>
  </Card>
  );
};
