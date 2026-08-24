import { useLessonProgress, statusShortLabel } from "@/lib/lessonProgress";
import { cn } from "@/lib/utils";
import { useLang } from "@/context/LanguageContext";

/** Compact "100% · ✓ Completed" / "25% · ● Started" / "0% · ○ Not started" marker. */
const LessonStatusBadge = ({ lessonId, className }: { lessonId: string; className?: string }) => {
  const { t } = useLang();
  const { status, progress } = useLessonProgress(lessonId);

  const icon = status === "completed" ? "✓ " : status === "started" ? "● " : "○ ";

  return (
    <span
      className={cn(
        "text-[11px] font-medium whitespace-nowrap",
        status === "completed"
          ? "text-success"
          : status === "started"
            ? "text-primary"
            : "text-muted-foreground",
        className,
      )}
    >
      {progress}% · {icon}
      {t(statusShortLabel[status])}
    </span>
  );
};

export default LessonStatusBadge;
