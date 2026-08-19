import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LessonStatus } from "@/lib/lessonProgress";
import { statusLabel } from "@/lib/lessonProgress";

interface Props {
  status: LessonStatus;
  onComplete: () => void;
  className?: string;
}

const LessonStatusControl = ({ status, onComplete, className }: Props) => {
  if (status === "completed") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success",
          className,
        )}
      >
        <Check className="h-3.5 w-3.5" /> {statusLabel.completed}
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-2 flex-wrap", className)}>
      <button
        type="button"
        onClick={onComplete}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition hover:border-success/40 hover:bg-success/10 hover:text-success"
      >
        <Circle className="h-3.5 w-3.5" /> Позначити урок як завершений
      </button>
    </div>
  );
};

export default LessonStatusControl;
