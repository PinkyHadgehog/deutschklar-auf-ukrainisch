import { useLessonProgress, statusShortLabel } from "@/lib/lessonProgress";
import { cn } from "@/lib/utils";

/** Compact "100% · ✓ Завершено" / "0% · Розпочато" marker for course overviews. */
const LessonStatusBadge = ({ lessonId, className }: { lessonId: string; className?: string }) => {
  const { status, progress } = useLessonProgress(lessonId);
  if (status === "not_started") return null;

  return (
    <span
      className={cn(
        "text-[11px] font-medium whitespace-nowrap",
        status === "completed" ? "text-success" : "text-primary",
        className,
      )}
    >
      {progress}% · {status === "completed" ? "✓ " : "● "}
      {statusShortLabel[status]}
    </span>
  );
};

export default LessonStatusBadge;
