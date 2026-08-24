import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, Crown, ChevronRight } from "lucide-react";
import type { LessonContent } from "@/content/lessons";
import { useLang } from "@/context/LanguageContext";

interface Props {
  lesson: LessonContent;
  progress: number;
  duration?: number;
  premium?: boolean;
  statusControl?: ReactNode;
  saveControl?: ReactNode;
}

const LessonHeader = ({ lesson, progress, duration, premium, statusControl, saveControl }: Props) => {
  const { t } = useLang();
  return (
  <div>
    <Link to="/grammar" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft className="h-4 w-4 mr-1" /> {t("lesson.backToGrammar")}
    </Link>

    {/* Breadcrumb */}
    <nav className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap" aria-label="Breadcrumb">
      <Link to="/grammar" className="hover:text-foreground">{t("lesson.breadcrumbGrammar")}</Link>
      <ChevronRight className="h-3 w-3" />
      <span className="text-foreground/70">{lesson.level}</span>
      <ChevronRight className="h-3 w-3" />
      <span className="text-foreground/70">{lesson.category}</span>
      <ChevronRight className="h-3 w-3" />
      <span className="text-foreground font-medium">{lesson.titleDe}</span>
    </nav>

    <div className="mt-3 flex items-center gap-2 flex-wrap">
      <Badge variant="secondary" className="bg-primary-soft text-primary border-0">{lesson.level}</Badge>
      <Badge variant="outline">{lesson.category}</Badge>
      <Badge variant="outline">{t("lesson.badgeGrammar")}</Badge>
      {duration && (
        <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3"/> {t("lesson.badgeMinutes", { n: duration })}</Badge>
      )}
      {premium ? (
        <Badge className="bg-amber-500/10 text-amber-600 border-0 gap-1"><Crown className="h-3 w-3"/> {t("lesson.badgePremium")}</Badge>
      ) : (
        <Badge className="bg-success/10 text-success border-0">{t("lesson.badgeFree")}</Badge>
      )}
    </div>

    <div className="mt-3 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold">{lesson.titleDe}</h1>
        <p className="text-muted-foreground mt-1">{lesson.titleUk}</p>
      </div>
      {saveControl && <div className="shrink-0">{saveControl}</div>}
    </div>

    <Progress value={progress} className="h-2 mt-5" />
    <div className="mt-2 flex items-start justify-between gap-3 flex-wrap">
      <div className="min-w-0">{statusControl}</div>
      <div className="ml-auto shrink-0 text-sm font-semibold text-foreground">{progress}%</div>
    </div>
  </div>
  );
};

export default LessonHeader;
