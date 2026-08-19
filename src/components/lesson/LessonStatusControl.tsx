import { Check, Circle, CircleDot, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LessonStatus } from "@/lib/lessonProgress";
import { statusLabel } from "@/lib/lessonProgress";

interface Props {
  status: LessonStatus;
  onComplete: () => void;
  onUndo?: () => void;
  className?: string;
}

const LessonStatusControl = ({ status, onComplete, onUndo, className }: Props) => {
  if (status === "completed") {
    return (
      <div className={cn("flex flex-col items-start gap-2", className)}>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
          <Check className="h-3.5 w-3.5" /> {statusLabel.completed}
        </div>
        <p className="text-xs text-muted-foreground">Ти позначила цей урок як завершений.</p>
        <button
          type="button"
          onClick={onUndo}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
          aria-label="Зняти позначку завершення"
        >
          <RotateCcw className="h-3 w-3" /> Зняти позначку
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
          status === "started"
            ? "border-primary/30 bg-primary/10 text-primary"
            : "border-border bg-muted/40 text-muted-foreground",
        )}
      >
        {status === "started" ? <CircleDot className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
        {statusLabel[status]}
      </div>
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
