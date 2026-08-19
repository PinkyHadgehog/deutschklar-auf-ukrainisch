import { Check, Circle, CircleDot, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LessonStatus } from "@/lib/lessonProgress";
import { statusLabel } from "@/lib/lessonProgress";

interface Props {
  status: LessonStatus;
  onStart?: () => void;
  onCancelStart?: () => void;
  onComplete: () => void;
  onUndo?: () => void;
  className?: string;
}

const LessonStatusControl = ({
  status,
  onStart,
  onCancelStart,
  onComplete,
  onUndo,
  className,
}: Props) => {
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

  if (status === "started") {
    return (
      <div className={cn("flex flex-col items-start gap-2", className)}>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <CircleDot className="h-3.5 w-3.5" /> {statusLabel.started}
          </div>
          <button
            type="button"
            onClick={onComplete}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition hover:border-success/40 hover:bg-success/10 hover:text-success"
          >
            <Circle className="h-3.5 w-3.5" /> Позначити урок як завершений
          </button>
        </div>
        <button
          type="button"
          onClick={onCancelStart}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3" /> Скасувати початок
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <button
        type="button"
        onClick={onStart}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
      >
        <Circle className="h-3.5 w-3.5" /> Розпочати урок
      </button>
    </div>
  );
};

export default LessonStatusControl;
