import { useLessonProgress, statusShortLabel } from "@/lib/lessonProgress";
import { cn } from "@/lib/utils";

/** Compact "100% · ✓ Завершено" / "25% · ● Розпочато" / "0% · ○ Не розпочато" marker. */
const LessonStatusBadge = ({ lessonId, className }: { lessonId: string; className?: string }) => {
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
      {statusShortLabel[status]}
    </span>
  );
};

export default LessonStatusBadge;
